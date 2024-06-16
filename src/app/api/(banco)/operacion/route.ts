import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { estadoCheque } from "@prisma/client";
import {Decimal} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import reflejarOperacion from "@/lib/moduloBanco/operacion/reflejarOperacion";
import { ChequeAndOperacion } from "@/lib/definitions";
import ApiError from "@/lib/api/ApiError";

export async function POST(req: NextRequest) {
  
  const body: ChequeAndOperacion = await req.json();

  const { 
    tipoOperacionId, 
    cuentaBancariaOrigenId, 
    monto, 
    concepto, 
    numeroComprobante, 
    cuentaInvolucrado, 
    nombreInvolucrado, 
    bancoInvolucrado, 
    rucInvolucrado, 
    fechaOperacion,
    cheques
  } = body;

  if(!tipoOperacionId || 
    !monto || 
    !numeroComprobante || 
    !concepto || 
    !cuentaBancariaOrigenId || 
    !fechaOperacion || 
    !nombreInvolucrado 
  ) return generateApiErrorResponse("No hay datos necesarios para crear la operacion", 400) //Validate credentials
  
  //Obtener la cuenta bancaria que se vera afectada por la operacion
  const currentCuentaBancarioOrigen = await prisma.cuentaBancaria.findUnique({
    where:{
      id: cuentaBancariaOrigenId
    }
  })

  if(!currentCuentaBancarioOrigen) return generateApiErrorResponse("Cuenta bancaria no encontrada", 400)

  if(currentCuentaBancarioOrigen.numeroCuenta === cuentaInvolucrado) return generateApiErrorResponse("Las cuentas involucradas no pueden ser iguales", 400)

  if(new Decimal(monto).lessThanOrEqualTo(0)) return generateApiErrorResponse("Monto invalido", 400)
    
  if(cheques && cheques.length !== 0){
      const sum = cheques.reduce((total, obj) => total + (+obj.monto), 0)
      if(new Decimal(monto).lessThan(sum)) return generateApiErrorResponse("La suma de los montos de los cheques no puede ser mayor al monto de la operacion", 400)
  }
  
  try{
    const operacion = await prisma.$transaction(async (tx) => {

      const operacionTx = await tx.operacion.create({
        data: {
          tipoOperacionId,
          fechaOperacion: new Date(fechaOperacion),
          monto,
          cuentaBancariaOrigenId,
          nombreInvolucrado,
          concepto,
          numeroComprobante,
          cuentaInvolucrado,
          rucInvolucrado,
          bancoInvolucrado
        },
        include: {
          cuentaBancariaOrigen: {
            select: {
              saldo: true,
              saldoDisponible: true
            }
          },
          tipoOperacion: {
            select: {
              nombre: true,
              afectaSaldo: true,
              afectaSaldoDisponible: true,
              esDebito: true
            }
          }
        }
      })

      if(
        operacionTx.tipoOperacion.nombre.startsWith("TRANSFERENCIA") &&
        (
          !operacionTx.bancoInvolucrado ||
          !operacionTx.cuentaInvolucrado ||
          !operacionTx.rucInvolucrado
        )
      )
      throw new ApiError("No existe suficiente informacion del involucrado para crear la operacion", 400)

      //Validar si los saldos son suficiente
      if (operacionTx.tipoOperacion.esDebito &&
        (
          operacionTx.tipoOperacion.afectaSaldo && operacionTx.cuentaBancariaOrigen.saldo.sub(monto).lessThanOrEqualTo(0) ||
          operacionTx.tipoOperacion.afectaSaldoDisponible && operacionTx.cuentaBancariaOrigen.saldoDisponible.sub(monto).lessThanOrEqualTo(0) 
        )
      )
      throw new ApiError("Saldo insuficiente para realizar la operacion", 400);

      if(cheques && cheques.length !== 0){
        for(const cheque of cheques){
          const { numeroCheque, involucrado, monto, esRecibido, bancoChequeId } = cheque
          if(!numeroCheque || !involucrado || !monto || esRecibido===undefined || esRecibido===null || !bancoChequeId) throw new ApiError("Uno de los cheques no tiene informacion suficiente para ser procesada la operacion", 400)
          await tx.cheque.create({
            data: {
              operacionId: operacionTx.id,
              numeroCheque: cheque.numeroCheque,
              involucrado: cheque.involucrado,
              monto: cheque.monto,
              fechaEmision: !cheque.esRecibido? operacionTx.fechaOperacion : cheque.fechaEmision,
              esRecibido: cheque.esRecibido,
              cuentaBancariaAfectadaId: operacionTx.cuentaBancariaOrigenId,
              bancoChequeId: cheque.bancoChequeId,
              fechaPago:cheque.esRecibido? new Date() : null,
              estado: cheque.esRecibido? estadoCheque.PAGADO : estadoCheque.EMITIDO,
            }
          })
        }
      }
      return operacionTx
    })

    if(!operacion) return generateApiErrorResponse("Error generating operation", 400)  

    //Refleja el incremento o decremento en el saldo de la cuenta bancaria siguiendo las propiedades del tipo de Operacion
    await reflejarOperacion(cuentaBancariaOrigenId, monto, operacion.tipoOperacion.esDebito, operacion.tipoOperacion.afectaSaldo, operacion.tipoOperacion.afectaSaldoDisponible)

    return generateApiSuccessResponse(200, "La operacion se genero correctamente")
  
  }catch(err){
    if(err instanceof ApiError) return generateApiErrorResponse(err.message, err.status)
    if(err instanceof Error) return generateApiErrorResponse(err.message, 400)
    else return generateApiErrorResponse("Something went wrong", 500)
  }  
}

export async function GET() {

  const operacion = await prisma.operacion.findMany()

  return generateApiSuccessResponse(200, "operation list", operacion)

}
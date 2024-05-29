import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { estadoCheque } from "@prisma/client";
import {PrismaClientKnownRequestError, Decimal} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import reflejarOperacion from "@/lib/moduloBanco/operacion/reflejarOperacion";
import { ChequeAndOperacion } from "@/lib/definitions";

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
    fechaOperacion  
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
  
  try{
    //Validar la existencia del tipo de operacion
    const tipoOperacion = await prisma.tipoOperacion.findFirst({
      where: {
        id: tipoOperacionId,
      },
    });
    if (!tipoOperacion)
      throw new Error("No existe el tipo de Operacion ingresado");

    //Obtener caracteristicas clave del tipo de operacion a ejecutar
    const esDebito = tipoOperacion.esDebito;
    const afectaSaldo = tipoOperacion.afectaSaldo;
    const afectaSaldoDisponible = tipoOperacion.afectaSaldoDisponible;
  
    //Validar si los saldos son suficiente
    if (
      esDebito &&
      (
        afectaSaldo && currentCuentaBancarioOrigen?.saldo.sub(monto).lessThanOrEqualTo(0) ||
        afectaSaldoDisponible && currentCuentaBancarioOrigen?.saldoDisponible.sub(monto).lessThanOrEqualTo(0) 
      )
    )
      throw new Error("Saldo insuficiente para realizar la operacion");

    const {cheques} = body
    
    if(cheques && cheques.length !== 0){
      const sum = cheques.reduce((total, obj) => total + (+obj.monto), 0)
      if(new Decimal(monto).lessThan(sum)) return generateApiErrorResponse("La suma de los montos de los cheques no puede ser mayor al monto de la operacion", 400)
    }

    const operacion = await prisma.operacion.create({
      data: {
        tipoOperacionId, 
        cuentaBancariaOrigenId, 
        monto, 
        concepto, 
        numeroComprobante, 
        cuentaInvolucrado, 
        nombreInvolucrado, 
        bancoInvolucrado, 
        rucInvolucrado, 
        fechaOperacion
      },
      include: {
        tipoOperacion: true
      }
    })

    if(cheques && cheques.length !== 0){
      for(const cheque of cheques){
        const currentCheque = await prisma.cheque.create({
          data: {
            operacionId: operacion.id,
            numeroCheque: cheque.numeroCheque,
            involucrado: cheque.involucrado,
            monto: cheque.monto,
            fechaEmision: cheque.fechaEmision,
            esRecibido: cheque.esRecibido,
            cuentaBancariaAfectadaId: operacion.cuentaBancariaOrigenId,
            bancoChequeId: cheque.bancoChequeId,
            fechaPago:cheque.esRecibido? new Date() : null,
            estado: cheque.esRecibido? estadoCheque.PAGADO : estadoCheque.EMITIDO,
          }
        })
        if(!currentCheque) return generateApiErrorResponse(`Cheque num: ${cheque.numeroCheque} no creado`, 400)
      }
    }

    if(!operacion) return generateApiErrorResponse("Error generating operation", 400)  

    //Refleja el incremento o decremento en el saldo de la cuenta bancaria siguiendo las propiedades del tipo de Operacion
    await reflejarOperacion(cuentaBancariaOrigenId, monto, esDebito, afectaSaldo, afectaSaldoDisponible)

    return generateApiSuccessResponse(200, "La operacion se genero correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("operation already exists", 400)
    if(err instanceof Error) return generateApiErrorResponse(err.message, 400)
    else return generateApiErrorResponse("Something went wrong", 500)
  }  
}

export async function GET() {

  const operacion = await prisma.operacion.findMany()

  return generateApiSuccessResponse(200, "operation list", operacion)

}
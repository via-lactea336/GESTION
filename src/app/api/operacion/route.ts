import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Operacion } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import reflejarOperacion from "@/lib/operacion/reflejarOperacion";

export async function POST(req: NextRequest) {
  
  const body: Operacion = await req.json();
  const { tipoOperacionId, cuentaBancariaOrigenId, monto, concepto, numeroComprobante, cuentaInvolucrado, nombreInvolucrado, bancoInvolucrado, rucInvolucrado, fechaOperacion  } = body;

  const currentCuentaBancarioOrigen = await prisma.cuentaBancaria.findFirst({
    where:{
      id: cuentaBancariaOrigenId
    }
  })
  if(!currentCuentaBancarioOrigen) return generateApiErrorResponse("Cuenta bancaria no encontrada", 400)

  if(!tipoOperacionId || !monto || !numeroComprobante || !concepto || !cuentaBancariaOrigenId || !fechaOperacion || !cuentaInvolucrado || !nombreInvolucrado || !bancoInvolucrado || !rucInvolucrado) return generateApiErrorResponse("Missing data to create the operation", 400) //Validate credentials

  if(currentCuentaBancarioOrigen.numeroCuenta === cuentaInvolucrado) return generateApiErrorResponse("Las cuentas involucradas no pueden ser iguales", 400)

  if(Number(monto) <= 0) return generateApiErrorResponse("Monto invalido", 400)
  
  try{
    //Obtener la cuenta bancaria afectada
    const cuentaBancariaVerif = await prisma.cuentaBancaria.findUnique({
      where: {
        id: cuentaBancariaOrigenId,
      },
    });
  
    //Validar la existencia del tipo de operacion
    const tipoOperacion = await prisma.tipoOperacion.findFirst({
      where: {
        id: tipoOperacionId,
      },
    });
  
    //Validar la existencia del tipo de operacion
    if (!tipoOperacion)
      throw new Error("No existe el tipo de Operacion ingresado");
  

    //Obtener caracteristicas clave del tipo de operacion a ejecutar
    const esDebito = tipoOperacion.esDebito;
    const afectaSaldo = tipoOperacion.afectaSaldo;
  
    //Validar si el saldo es suficiente
    if (
      esDebito &&
      afectaSaldo &&
      Number(cuentaBancariaVerif?.saldoDisponible) - Number(monto) <= 0
    )
      throw new Error("Saldo disponible insuficiente para realizar la operacion");
    if (esDebito && Number(cuentaBancariaVerif?.saldo) - Number(monto) <= 0)
      throw new Error("Saldo retenido insuficiente para realizar la operacion");

    const operacion = await prisma.operacion.create({
      data: {
        tipoOperacionId, cuentaBancariaOrigenId, monto, concepto, numeroComprobante, cuentaInvolucrado, nombreInvolucrado, bancoInvolucrado, rucInvolucrado, fechaOperacion
      },
      include: {
        tipoOperacion: true
      }
    })
  
    if(!operacion) return generateApiErrorResponse("Error generating operation", 400)  

    //Refleja el incremento o decremento en el saldo de la cuenta bancaria siguien las propiedades del tipo de Operacion
    await reflejarOperacion(cuentaBancariaOrigenId, Number(monto), esDebito, afectaSaldo)

    return generateApiSuccessResponse(200, "operation added successfully")
  
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
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Operacion } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import reflejarOperacion from "@/lib/operacion/reflejarOperacion";

export async function POST(req: NextRequest) {
  
  const body: Operacion = await req.json();
  const { tipoOperacionId, cuentaBancariaOrigenId, monto, concepto, numeroComprobante, cuentaInvolucrado, nombreInvolucrado, bancoInvolucrado, rucInvolucrado  } = body;

  const currentCuentaBancarioOrigen = await prisma.cuentaBancaria.findFirst({
    where:{
      id: cuentaBancariaOrigenId
    }
  })
  if(!currentCuentaBancarioOrigen) return generateApiErrorResponse("Cuenta bancaria no encontrada", 400)

  if(!tipoOperacionId || !monto || !numeroComprobante || !concepto || !cuentaBancariaOrigenId || !cuentaInvolucrado || !nombreInvolucrado || !bancoInvolucrado || !rucInvolucrado) return generateApiErrorResponse("Missing data to create the operation", 400) //Validate credentials

  if(currentCuentaBancarioOrigen.numeroCuenta === cuentaInvolucrado) return generateApiErrorResponse("Las cuentas involucradas no pueden ser iguales", 400)

  if(Number(monto) <= 0) return generateApiErrorResponse("Monto invalido", 400)
  
  try{

    //Refleja el incremento o decremento en el saldo de la cuenta bancaria siguien las propiedades del tipo de Operacion
    reflejarOperacion(cuentaBancariaOrigenId, monto, tipoOperacionId)

    const operacion = await prisma.operacion.create({
      data: {
        tipoOperacionId, cuentaBancariaOrigenId, monto, concepto, numeroComprobante, cuentaInvolucrado, nombreInvolucrado, bancoInvolucrado, rucInvolucrado
      },
      include: {
        tipoOperacion: true
      }
    })
  
    if(!operacion) return generateApiErrorResponse("Error generating operation", 400)  

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
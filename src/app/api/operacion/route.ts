import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Operacion } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";


export async function POST(req: NextRequest) {
  
  const body: Operacion = await req.json();
  const { tipoOperacionId, cuentaBancariaOrigenId, monto, concepto, numeroComprobante, cuentaInvolucrado, nombreInvolucrado, bancoInvolucrado, rucInvolucrado  } = body;
  
  if(!tipoOperacionId || !monto || !numeroComprobante || !concepto || !cuentaBancariaOrigenId || !cuentaInvolucrado || !nombreInvolucrado || !bancoInvolucrado || !rucInvolucrado) return generateApiErrorResponse("Missing data to create the operation", 400) //Validate credentials

  try{
    const operacion = await prisma.operacion.create({
      data: {
        tipoOperacionId, cuentaBancariaOrigenId, monto, concepto, numeroComprobante, cuentaInvolucrado, nombreInvolucrado, bancoInvolucrado, rucInvolucrado
      }
    })
  
    if(!operacion) return generateApiErrorResponse("Error generating operation", 400)  

    return generateApiSuccessResponse(200, "operation added successfully")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("operation already exists", 400)
    else return generateApiErrorResponse("Something went wrong", 500)
  }  
  
}

export async function GET() {

  const operacion = await prisma.operacion.findMany()

  return generateApiSuccessResponse(200, "operation list", operacion)

}
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { RegistroCaja } from "@prisma/client";
import calcularDatosRegistroCaja from "@/lib/moduloCaja/resumenDiario";

export async function POST(req: NextRequest) {
  
  const body:RegistroCaja= await req.json();
  
  const { 
    aperturaId,
   } = body;
  
  if( !aperturaId ) return generateApiErrorResponse("Faltan datos para la creacion del registro", 400)

  try{
     await calcularDatosRegistroCaja(aperturaId)
    return generateApiSuccessResponse(200, "El registro fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El registro ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion del registro", 500)
  }  
}

export async function GET() {
  const registros = await prisma.registroCaja.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de registros", registros)
}
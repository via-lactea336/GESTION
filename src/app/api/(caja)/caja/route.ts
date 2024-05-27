import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { Caja } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body: Caja = await req.json();
  const { numero, saldo } = body;

  if(!numero || !saldo ) return generateApiErrorResponse("Faltan datos para la caja", 400)

  try{
    const caja = await prisma.caja.create({
      data: {
        numero,
        saldo
      }
    })
  
    if(!caja) return generateApiErrorResponse("Error generando la caja", 400) 

    return generateApiSuccessResponse(200, "La caja fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("La caja ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion de la caja", 500)
  }  
}

export async function GET() {
  const cajas = await prisma.caja.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de cajas", cajas)
}
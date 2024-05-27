import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { Movimiento } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body: Movimiento = await req.json();
  const { 
    aperturaId,
    monto,
   } = body;

  if(!aperturaId || !monto ) return generateApiErrorResponse("Faltan datos para el movimiento", 400)

  try{
    const movimiento = await prisma.movimiento.create({
      data: {
        monto,
        aperturaId, 
      }
    })
  
    if(!movimiento) return generateApiErrorResponse("Error generando el movimiento", 400) 

    return generateApiSuccessResponse(200, "El movimiento fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El movimiento ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion del movimiento", 500)
  }  
}

export async function GET() {
  const movimiento = await prisma.movimiento.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener los movimientos", movimiento)
}
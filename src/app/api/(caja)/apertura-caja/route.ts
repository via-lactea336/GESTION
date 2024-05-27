import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { AperturaCaja } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body: AperturaCaja = await req.json();
  const { 
    cajaId,
    cajeroId,
    apertura,
    aperturaDeCaja,
   } = body;

  if(
    !cajaId || 
    !cajeroId || 
    !apertura || 
    !aperturaDeCaja
  ) return generateApiErrorResponse("Faltan datos para la apertura de caja", 400)

  try{
    const aperturaCaja = await prisma.aperturaCaja.create({
      data: {
        cajaId,
        cajeroId,
        apertura,
        aperturaDeCaja,
      }
    })
  
    if(!aperturaCaja) return generateApiErrorResponse("Error generando la apertura de caja", 400) 

    return generateApiSuccessResponse(200, "La apertura de caja fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("La apertura de caja ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion de la apertura de caja", 500)
  }  
}

export async function GET() {
  const aperturasCaja = await prisma.aperturaCaja.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de apertura de cajas", aperturasCaja)
}
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { Recibos, FacturaDetalles } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body:Recibos= await req.json();
  
  const { 
    clienteId,
    facturaId,
    totalPagado,
    movimientoId
   } = body;
  
  if( !clienteId || !facturaId || !totalPagado || !movimientoId ) return generateApiErrorResponse("Faltan datos para la creacion de el recibo", 400)

  try{
    const recibo = await prisma.recibos.create({
      data: {
        clienteId,
        movimientoId,
        facturaId,
        totalPagado: totalPagado,
      }
    })
  
    if(!recibo) return generateApiErrorResponse("Error generando el recibo", 400)

    return generateApiSuccessResponse(200, "El recibo fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El recibo ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion de el recibo", 500)
  }  
}

export async function GET() {
  const recibos = await prisma.recibos.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de recibos", recibos)
}
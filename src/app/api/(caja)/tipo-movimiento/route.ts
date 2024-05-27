import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { TipoMovimiento } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body: TipoMovimiento = await req.json();
  const { 
    nombre,
    metodoPago,
    esIngreso,
   } = body;

  if(!nombre || !metodoPago || !esIngreso ) return generateApiErrorResponse("Faltan datos para el tipo de movimiento", 400)

  try{
    const tipoMovimiento = await prisma.tipoMovimiento.create({
      data: {
        nombre,
        metodoPago,
        esIngreso, 
      }
    })
  
    if(!tipoMovimiento) return generateApiErrorResponse("Error generando el tipo de movimiento", 400) 

    return generateApiSuccessResponse(200, "El tipo de movimiento fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El tipo de movimiento ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion del tipo de movimiento", 500)
  }  
}

export async function GET() {
  const movimientoDetalle = await prisma.movimientoDetalle.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener los tipos de movimientos", movimientoDetalle)
}
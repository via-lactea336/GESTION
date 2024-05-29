import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { Comprobante } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body:Comprobante= await req.json();
  
  const { 
    concepto,
    monto, 
    docIdentidad,
    nombre,
    movimientoId
   } = body;
  
  if( !monto || !concepto || !docIdentidad || !nombre || !movimientoId ) return generateApiErrorResponse("Faltan datos para la creacion de el comprobante", 400)

  try{
    const comprobante = await prisma.comprobante.create({
      data: {
        concepto,
        monto, 
        docIdentidad,
        nombre,
        movimientoId
      }
    })
  
    if(!comprobante) return generateApiErrorResponse("Error generando el comprobante", 400)

    return generateApiSuccessResponse(200, "el comprobante fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("el comprobante ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion de el comprobante", 500)
  }  
}

export async function GET() {
  const comprobantes = await prisma.comprobante.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de comprobantes", comprobantes)
}
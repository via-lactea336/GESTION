import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { Factura } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body:{factura:Factura} = await req.json();
  
  const { 
    clienteId,
    esContado,
    total,
    ivaTotal,
    totalSaldoPagado
   } = body.factura;
  

  if(!clienteId || !total || (esContado === undefined && esContado === null) ) return generateApiErrorResponse("Faltan datos para la creacion de la factura", 400)

  try{
    const factura = await prisma.factura.create({
      data: {
        clienteId,
        totalSaldoPagado:totalSaldoPagado? totalSaldoPagado : esContado? total : 0, 
        esContado,
        total,
        ivaTotal,
      }
    })
  
    if(!factura) return generateApiErrorResponse("Error generando la factura", 400) 

    return generateApiSuccessResponse(200, "La factura fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("La factura ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion de la factura", 500)
  }  
}

export async function GET() {
  const facturas = await prisma.factura.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de facturas", facturas)
}
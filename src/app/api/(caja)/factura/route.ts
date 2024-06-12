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
    totalSaldoPagado,
    fechaEmision,
    fechaVencimiento,
    pagado,
    numeroFactura,
    concepto
   } = body.factura;
  

  if(!clienteId || !total || !fechaEmision || !numeroFactura ||(esContado === undefined && esContado === null) ) return generateApiErrorResponse("Faltan datos para la creacion de la factura", 400)

  try{
    const factura = await prisma.factura.create({
      data: {
        numeroFactura,
        pagado,
        fechaEmision: fechaEmision || new Date(),
        fechaVencimiento: fechaVencimiento || null,
        clienteId,
        totalSaldoPagado, 
        esContado,
        total,
        ivaTotal,
        concepto
      }
    })
  
    if(!factura) return generateApiErrorResponse("Error generando la factura", 400) 

    return generateApiSuccessResponse(200, "La factura fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("Una factura con el mismo numero ya existe", 400)
    if(err instanceof Error) return generateApiErrorResponse(err.message, 500)
    else return generateApiErrorResponse("Hubo un error en la creacion de la factura", 500)
  }  
}

export async function GET() {
  const facturas = await prisma.factura.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de facturas", facturas)
}
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { FacturaDetalles } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body: FacturaDetalles = await req.json();
  const { 
    facturaId,
    productoId,
    costoUnit,
    cantidad,
    monto,
    iva,
    ivaPorcent
   } = body;

  if(!facturaId || !costoUnit || !cantidad || !monto) return generateApiErrorResponse("Faltan datos para la creacion de la factura", 400)
  
  try{
    const facturaDetalle = await prisma.facturaDetalles.create({
      data: {
        facturaId,
        productoId,
        costoUnit,
        cantidad,
        monto,
        iva: ivaPorcent && ivaPorcent > 0 ? iva : 0,
        ivaPorcent
      }
    })
  
    if(!facturaDetalle) return generateApiErrorResponse("Error generando la factura detalle", 400) 

    await prisma.factura.update({
      where: {
        id:facturaId
      },
      data: {
        total: {
          increment: monto
        }
      }
    })

    return generateApiSuccessResponse(200, "La factura detalle fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("La factura detalle ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion de la factura detalle", 500)
  }  
}

export async function GET() {
  const facturas = await prisma.factura.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de facturas detalles", facturas)
}
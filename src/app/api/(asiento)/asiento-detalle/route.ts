
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { DetalleAsiento } from "@prisma/client";
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  
  const body: DetalleAsiento = await req.json();
  const { esDebe, monto, asientoId, cuentaId } = body;

  if(!asientoId || !cuentaId || !monto || esDebe === undefined) return generateApiErrorResponse("Faltan datos para la creacion de la cuenta", 400)

  try {

    const asientoDetalle = await prisma.detalleAsiento.create({
      data: {
        esDebe,
        monto,
        asientoId,
        cuentaId
      }
    })

    if(!asientoDetalle) return generateApiErrorResponse("Error generando el asiento", 500)

    return generateApiSuccessResponse(200, "El asiento Detalle fue creada correctamente", asientoDetalle)

  } catch (error) {
    if(error instanceof PrismaClientKnownRequestError){
      if(error.code === "P2002") return generateApiErrorResponse("El asiento detalle ya existe", 400)
    }
    else if(error instanceof Error) return generateApiErrorResponse(error.message, 500)
    return generateApiErrorResponse("Hubo un error en la creacion del asiento detalle", 500)
  }

}

export async function GET() {
  const asientoDetalle = await prisma.detalleAsiento.findMany()
  return generateApiSuccessResponse(200, "Asientos Detalles encontradas exitosamente", asientoDetalle)
}
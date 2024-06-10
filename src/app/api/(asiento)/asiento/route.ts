
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Asiento } from "@prisma/client";
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  
  const body: Asiento = await req.json();
  const { fecha, descripcion } = body;

  if(!fecha || !descripcion) return generateApiErrorResponse("Faltan datos para la creacion del asiento", 400)

  try {

    const asiento = await prisma.asiento.create({
      data: {
        fecha,
        descripcion
      }
    })

    if(!asiento) return generateApiErrorResponse("Error generando el asiento", 500)

    return generateApiSuccessResponse(200, "El asiento fue creada correctamente", asiento)

  } catch (error) {
    if(error instanceof PrismaClientKnownRequestError){
      if(error.code === "P2002") return generateApiErrorResponse("El asiento ya existe", 400)
    }
    else if(error instanceof Error) return generateApiErrorResponse(error.message, 500)
    return generateApiErrorResponse("Hubo un error en la creacion del asiento", 500)
  }

}

export async function GET() {
  const asiento = await prisma.asiento.findMany()
  return generateApiSuccessResponse(200, "Asientos encontradas exitosamente", asiento)
}
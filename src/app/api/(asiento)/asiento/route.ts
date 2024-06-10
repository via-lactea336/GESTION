
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Asiento, DetalleAsiento } from "@prisma/client";
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  
  const body: {asiento:Asiento, asientoDetalle:DetalleAsiento[]} = await req.json();
  const { asiento, asientoDetalle } = body;
  
  //Extraer y validar info del asiento
  const { fecha, descripcion } = asiento;
  if(!fecha || !descripcion) return generateApiErrorResponse("Faltan datos para la creacion del asiento", 400)

  //Extraer y validar info de los detalles del asiento
  if(asientoDetalle.length === 0) return generateApiErrorResponse("Faltan detalles para la creacion del asiento", 400)

  try {

    await prisma.$transaction(async (tx) => {
      await tx.asiento.create({
        data: {
          fecha,
          descripcion
        }
      })
      await tx.detalleAsiento.createMany({
        data: asientoDetalle
      })    })

    return generateApiSuccessResponse(200, "El asiento fue creada correctamente")

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
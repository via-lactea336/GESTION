import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Cuenta } from "@prisma/client";
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  
  const body: Cuenta = await req.json();
  const { codigo, nombre, asentable } = body;

  if(!codigo || !nombre || asentable === undefined) return generateApiErrorResponse("Faltan datos para la creacion de la cuenta", 400)

  try {

    const cuenta = await prisma.cuenta.create({
      data: {
        codigo,
        nombre,
        asentable
      }
    })

    if(!cuenta) return generateApiErrorResponse("Error generando la cuenta", 400)

    return generateApiSuccessResponse(200, "La cuenta fue creada correctamente", cuenta)

  } catch (error) {
    if(error instanceof PrismaClientKnownRequestError){
      if(error.code === "P2002") return generateApiErrorResponse("La cuenta ya existe", 400)
    }
    else if(error instanceof Error) return generateApiErrorResponse(error.message, 500)
    return generateApiErrorResponse("Hubo un error en la creacion de la cuenta", 500)
  }

}

export async function GET() {
  const cuentas = await prisma.cuenta.findMany()
  return generateApiSuccessResponse(200, "Cuentas encontradas exitosamente", cuentas)
}
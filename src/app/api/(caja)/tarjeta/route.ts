
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";

import { Tarjeta } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  try {
    const body: Tarjeta = await req.json();
    const { esCredito, numeroTarjeta } = body;

    return generateApiSuccessResponse(200, "El movimiento fue generado correctamente");
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return generateApiErrorResponse("El movimiento ya existe", 400);
    } else {
      console.error(err);
      return generateApiErrorResponse("Hubo un error en la creación del movimiento", 500);
    }
  }
}


export async function GET() {
  const tarjeta = await prisma.tarjeta.findMany();
  return generateApiSuccessResponse(
    200,
    "Exito al obtener las tarjetas",
    tarjeta
  );
}

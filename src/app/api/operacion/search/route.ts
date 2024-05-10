import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import { Operacion } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const fechaDesde = searchParams.get("fechaDesde");
  const fechaHasta = searchParams.get("fechaHasta");

  let values: Operacion[] | null = null;

  //Si hay informacion para la busqueda, agregarla al filtro
  const where = {
    createdAt: {
      gte: fechaDesde ? new Date(fechaDesde) : undefined,
      lte: fechaHasta ? new Date(fechaHasta) : undefined,
    },
  };

  //Asignar los elementos encontrados a los valores
  values = await prisma.operacion.findMany({
    where: where as any,
  });

  if (!values)
    return generateApiErrorResponse("Error intentando buscar Operaciones", 500);

  return generateApiSuccessResponse(200, "Operaciones encontradas", values);
}

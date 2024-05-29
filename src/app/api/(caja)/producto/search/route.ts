import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import { start } from "repl";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const nombre = searchParams.get("nombre");
  const codigo = searchParams.get("codigo");

  const upTo  = searchParams.get("upTo");

  const verifiedUpTo = (!upTo || Number.isNaN(parseInt(upTo))) ? 10 : parseInt(upTo)

  //Si hay informacion para la busqueda, agregarla al filtro
  const where = {
    nombre: nombre ? {
      startsWith: nombre
    }:undefined,
    codigo: codigo ? {
      startsWith: codigo
    }:undefined
  };

  //Asignar los elementos encontrados a los valores
  const values = await prisma.producto.findMany({
    take: verifiedUpTo,
    where: where as any,
    orderBy:{
      nombre: "asc"
    }
  });

  if (!values)
    return generateApiErrorResponse("Error intentando buscar Productos", 500);

  return generateApiSuccessResponse(200, "Productos encontrados", values);
}

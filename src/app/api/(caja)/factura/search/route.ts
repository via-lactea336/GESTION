import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const fechaDesde = searchParams.get("fechaDesde");
  const fechaHasta = searchParams.get("fechaHasta");

  const ruc = searchParams.get("ruc");
  const pagado = searchParams.get("pagado");
  const esContado = searchParams.get("esContado"); 

  const numeroFactura = searchParams.get("numeroFactura");

  const skip = searchParams.get("skip");
  const upTo  = searchParams.get("upTo");

  const verifiedSkip = (!skip || Number.isNaN(parseInt(skip))) ? 0 : parseInt(skip)
  const verifiedUpTo = (!upTo || Number.isNaN(parseInt(upTo))) ? 4 : parseInt(upTo)

  const fechaHastaDateTime = fechaHasta ? new Date(Number(fechaHasta.split("-")[0]), Number(fechaHasta.split("-")[1])-1, Number(fechaHasta.split("-")[2]), 23, 59, 59, 999) : undefined

  //Si hay informacion para la busqueda, agregarla al filtro
  const where = {
    createdAt: {
      gte: fechaDesde ? new Date(fechaDesde) : undefined,
      lte: fechaHastaDateTime ? fechaHastaDateTime : undefined,
    },
    numeroFactura: numeroFactura || undefined,
    esContado: esContado ? (esContado === "true" ? true : esContado === "false" ? false : undefined) : undefined,
    cliente:ruc ? {
      docIdentidad: ruc
    }: undefined,
    pagado: pagado ? (pagado === "true" ? true : pagado === "false" ? false : undefined) : undefined
  };

  //Asignar los elementos encontrados a los valores
  const values = await prisma.factura.findMany({
    skip: verifiedSkip,
    take: verifiedUpTo,
    where: {
      ...where
    },
    orderBy:{
      createdAt: "desc"
    },
    include: {
      cliente: {
        select: {
          docIdentidad: true,
          nombre: true,
        }
      }
    }
  });

  const count = await prisma.factura.count({ where: where as any });
  if (!values)
    return generateApiErrorResponse("Error intentando buscar Facturas", 500);

  return generateApiSuccessResponse(200, "Facturas encontradas", {values:values, totalQuantity: count});
}

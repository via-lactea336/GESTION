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
  
  const montoDesde = searchParams.get("montoDesde")
  const montoHasta = searchParams.get("montoHasta")

  const esDebito = searchParams.get("esDebito");
  const tipoOperacion = searchParams.get("tipoOperacion");
  const banco = searchParams.get("banco");

  const skip = searchParams.get("skip");
  const upTo  = searchParams.get("upTo");

  const cuenta = searchParams.get("cuentaId");

  const verifiedSkip = (!skip || Number.isNaN(parseInt(skip))) ? 0 : parseInt(skip)
  const verifiedUpTo = (!upTo || Number.isNaN(parseInt(upTo))) ? 4 : parseInt(upTo)

  const amounts = [ 
    (!montoDesde || Number.isNaN(parseFloat(montoDesde)))? undefined : parseFloat(montoDesde), 
    (!montoHasta || Number.isNaN(parseFloat(montoHasta)))? undefined : parseFloat(montoHasta)
  ] 

  const fechaHastaDateTime = fechaHasta ? new Date(Number(fechaHasta.split("-")[0]), Number(fechaHasta.split("-")[1])-1, Number(fechaHasta.split("-")[2]), 23, 59, 59, 999) : undefined

  //Si hay informacion para la busqueda, agregarla al filtro
  const where = {
    fechaOperacion: {
      gte: fechaDesde ? new Date(fechaDesde) : undefined,
      lte: fechaHastaDateTime ? fechaHastaDateTime : undefined,
    },
    cuentaBancariaOrigenId: cuenta? cuenta : undefined,
    bancoInvolucrado: banco? banco : undefined,
    monto:{
      gte:amounts[0],
      lte:amounts[1]
    },
    tipoOperacion:esDebito || tipoOperacion? {
      id: tipoOperacion? tipoOperacion : undefined,
      esDebito: esDebito ? esDebito === "true"? true : esDebito === "false"? false : undefined : undefined,
    }:undefined
  };

  //Asignar los elementos encontrados a los valores
  const values = await prisma.operacion.findMany({
    skip: verifiedSkip,
    take: verifiedUpTo,
    where: where as any,
    include:{
      tipoOperacion: true
    },
    orderBy:{
      fechaOperacion: "desc"
    }
  });

  const count = await prisma.operacion.count({ where: where as any });
  if (!values)
    return generateApiErrorResponse("Error intentando buscar Operaciones", 500);

  return generateApiSuccessResponse(200, "Operaciones encontradas", {values:values, totalQuantity: count});
}

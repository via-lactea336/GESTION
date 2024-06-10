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

  const cajaId = searchParams.get("cajaId");
  const cerrada = searchParams.get("cerrada");

  const skip = searchParams.get("skip");
  const upTo  = searchParams.get("upTo");

  const verifiedSkip = (!skip || Number.isNaN(parseInt(skip))) ? 0 : parseInt(skip)
  const verifiedUpTo = (!upTo || Number.isNaN(parseInt(upTo))) ? 4 : parseInt(upTo)

  const fechaHastaDateTime = fechaHasta ? new Date(Number(fechaHasta.split("-")[0]), Number(fechaHasta.split("-")[1])-1, Number(fechaHasta.split("-")[2]), 23, 59, 59, 999) : undefined

  const where = {
    cierreCaja: cerrada ? (cerrada === "true" ? {not:null} : undefined):undefined,
    registro: cerrada && cerrada === "true" ? {isNot: null} : undefined,
    apertura: {
      gte: fechaDesde ? new Date(fechaDesde) : undefined,
      lte: fechaHastaDateTime ? fechaHastaDateTime : undefined,
    },
    cajaId: cajaId ? cajaId : undefined
  }

  //Asignar los elementos encontrados a los valores
  const values = await prisma.aperturaCaja.findMany({
    skip: verifiedSkip,
    take: verifiedUpTo,
    include:{
      registro:{
        select:{
          id: true,
          montoIngresoTotal: true,
          montoEgresoTotal: true
        }
      },
      cajero: {
        select:{
          nombre: true,
          apellido: true
        }
      },
      caja: {
        select:{
          numero: true
        }
      }
    },
    where:{
      ...where,
    },
    orderBy:{
      apertura: "desc"
    }
  });

  const count = await prisma.aperturaCaja.count({ where: {...where}});
  if (!values)
    return generateApiErrorResponse("Error intentando buscar aperturas", 500);

  return generateApiSuccessResponse(200, "Aperturas encontradas", {values:values, totalQuantity: count});
}

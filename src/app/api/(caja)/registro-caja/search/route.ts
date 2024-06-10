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
  const documentacion = searchParams.get("documentacion");

  const skip = searchParams.get("skip");
  const upTo  = searchParams.get("upTo");

  const verifiedSkip = (!skip || Number.isNaN(parseInt(skip))) ? undefined : parseInt(skip)
  const verifiedUpTo = (!upTo || Number.isNaN(parseInt(upTo))) ? undefined : parseInt(upTo)

  const fechaHastaDateTime = fechaHasta ? new Date(Number(fechaHasta.split("-")[0]), Number(fechaHasta.split("-")[1])-1, Number(fechaHasta.split("-")[2]), 23, 59, 59, 999) : undefined

  //Si hay informacion para la busqueda, agregarla al filtro
  const where = {
    createdAt: {
      gte: fechaDesde ? new Date(fechaDesde) : undefined,
      lte: fechaHastaDateTime ? fechaHastaDateTime : undefined,
    },
  };

  //Asignar los elementos encontrados a los valores
  const values = await prisma.registroCaja.findMany({
    skip: verifiedSkip,
    take: verifiedUpTo,
    where: {
      ...where,
      apertura: cajaId? {
        cajaId: cajaId
      } :undefined
    },
    include: documentacion === "true" ? {
      apertura:{
        include:{
          arqueo: true,
          movimiento: {
            include:{
              factura: true,
              comprobantes:{
                include:{
                  user:{
                    select:{
                      nombre: true,
                      apellido: true,
                      docIdentidad: true
                    }
                  }
                }
              },
              movimientoDetalles: {
                include:{
                  tarjeta: true,
                  chequeCaja: true
                }
              }
            }
          }
        }
      }
    }:undefined,
    orderBy:{
      createdAt: "desc"
    },
  });

  const count = await prisma.registroCaja.count({ where: {...where} });
  if (!values)
    return generateApiErrorResponse("Error intentando buscar Registros de Caja", 500);

  return generateApiSuccessResponse(200, "Busqueda de Registros de Caja exitoso", {values:values, totalQuantity: count});
}

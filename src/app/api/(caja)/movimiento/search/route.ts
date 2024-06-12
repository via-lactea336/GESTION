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

  const caja = searchParams.get("caja");
  const esIngreso = searchParams.get("esIngreso");

  const incluirDocumentacion = searchParams.get("incluirDocumentacion");

  const identificadorDocumento = searchParams.get("identificadorDocumento");

  const montoDesde = searchParams.get("montoDesde");
  const montoHasta = searchParams.get("montoHasta");

  const skip = searchParams.get("skip");
  const upTo = searchParams.get("upTo");

  const verifiedSkip =
    !skip || Number.isNaN(parseInt(skip)) ? undefined : parseInt(skip);
  const verifiedUpTo =
    !upTo || Number.isNaN(parseInt(upTo)) ? undefined : parseInt(upTo);

  const verifiedMontoDesde =
    !montoDesde || Number.isNaN(parseFloat(montoDesde))
      ? undefined
      : parseFloat(montoDesde);
  const verifiedMontoHasta =
    !montoHasta || Number.isNaN(parseFloat(montoHasta))
      ? undefined
      : parseFloat(montoHasta);

  const fechaHastaDateTime = fechaHasta
    ? new Date(
        Number(fechaHasta.split("-")[0]),
        Number(fechaHasta.split("-")[1]) - 1,
        Number(fechaHasta.split("-")[2]),
        23,
        59,
        59,
        999
      )
    : undefined;

  const where = {
    createdAt: {
      gte: fechaDesde ? new Date(fechaDesde) : undefined,
      lte: fechaHastaDateTime ? fechaHastaDateTime : undefined,
    },
    monto: {
      gte: verifiedMontoDesde,
      lte: verifiedMontoHasta,
    },
    apertura: caja
      ? {
          cajaId: caja,
        }
      : undefined,
    esIngreso: esIngreso
      ? esIngreso === "true"
        ? true
        : esIngreso === "false"
        ? false
        : undefined
      : undefined,
    OR:identificadorDocumento?[
        {factura:{
          numeroFactura:{contains:identificadorDocumento}
        }},
        {
          comprobantes:{
            some:{
              numeroComprobante:Number(identificadorDocumento)
            }
          }
        },
        {
          factura:{
            recibos:{
              some:{
                numeroRecibo:Number(identificadorDocumento)
              }
            }
          }
        }
      ]: undefined
  };

  //Asignar los elementos encontrados a los valores
  const values = await prisma.movimiento.findMany({
    skip: verifiedSkip,
    take: verifiedUpTo,
    where: {
      ...where,
    },
    include:
      incluirDocumentacion === "true"
        ? {
            movimientoDetalles: true,
            comprobantes: {
              include: {
                user: {
                  select: {
                    nombre: true,
                    apellido: true,
                    docIdentidad: true,
                  },
                },
              },
            },
            factura: {
              include: {
                recibos:true, 
                cliente: {
                  select: {
                    nombre: true,
                    docIdentidad: true,
                  },
                },
              },
            },
          }
        : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  const count = await prisma.movimiento.count({ where: { ...where } });
  if (!values)
    return generateApiErrorResponse("Error intentando buscar Movimientos", 500);

  return generateApiSuccessResponse(200, "Movimientos encontradas", {
    values: values,
    totalQuantity: count,
  });
}

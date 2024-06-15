import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const fechaDesde = searchParams.get("fechaDesde");
  const fechaHasta = searchParams.get("fechaHasta");

  const caja = searchParams.get("cajaId");
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

  const where: Prisma.MovimientoWhereInput = {
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
  };

  if (identificadorDocumento) {
    const orConditions: Prisma.MovimientoWhereInput[] = [];

    if (!isNaN(Number(identificadorDocumento))) {
      orConditions.push({
        comprobante: {numeroComprobante: Number(identificadorDocumento)},
      });
      orConditions.push({
        recibo: {numeroRecibo: Number(identificadorDocumento)},
      });
    }

    orConditions.push({
      factura: {
        numeroFactura: {
          search: identificadorDocumento,
        },
      },
    });

    where.OR = orConditions;
  }

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
            recibo:true,
            movimientoDetalles: true,
            apertura:{
              select:{
                cajero:{
                  select:{
                    nombre: true,
                    apellido: true,
                    docIdentidad: true
                  }
                },
                caja:{
                  select:{
                    numero: true
                  }
                }
              }
            },
            comprobante: {
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

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  Decimal,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";

import { ArqueoDeCaja } from "@prisma/client";
import calcularMontoEsperado from "@/lib/moduloCaja/arqueoCaja/calcularMontoEsperado";

export async function POST(req: NextRequest) {
  const body: ArqueoDeCaja = await req.json();
  const { aperturaId, montoRegistrado } = body;

  if (!aperturaId || (montoRegistrado === undefined || montoRegistrado === null))
    return generateApiErrorResponse("Faltan datos para el arqueo de caja", 400);

  const montoRegistradoDecimal = new Decimal(montoRegistrado);

  if (montoRegistradoDecimal.lessThan(0))
    return generateApiErrorResponse("El monto debe ser mayor o igual a 0", 400);

  const montoEsperado = await calcularMontoEsperado(aperturaId);
  console.log(montoEsperado, aperturaId);
  try {
    const arqueoCaja = await prisma.arqueoDeCaja.create({
      data: {
        aperturaId,
        montoRegistrado,
        montoEsperado: new Decimal(montoEsperado),
      },
      include: {
        apertura: {
          select: {
            cajaId: true,
          },
        },
      },
    });

    if (!arqueoCaja)
      return generateApiErrorResponse("Error generando el arqueo de caja", 400);

    if (montoRegistradoDecimal.equals(montoEsperado)) {
      const aperturaCaja = await prisma.aperturaCaja.update({
        where: {
          id: arqueoCaja.aperturaId,
        },
        data: {
          cierreCaja: new Date(),
        },
      });
      const caja = await prisma.caja.update({
        where: {
          id: arqueoCaja.apertura.cajaId,
        },
        data: {
          estaCerrado: true,
        },
      });
      if (!aperturaCaja || !caja)
        return generateApiErrorResponse(
          "Error cerrando la caja y la apertura de caja",
          400
        );
      return generateApiSuccessResponse(
        200,
        "El arqueo fue generada correctamente y la caja fue cerrada",
        arqueoCaja
      );
    }
    return generateApiSuccessResponse(
      200,
      "El arqueo fue generada correctamente pero los datos no coinciden, se necesita intervencion del administrador"
    );
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002")
      return generateApiErrorResponse("El arqueo de caja ya existe", 400);
    if (err instanceof Error) {
      return generateApiErrorResponse(err.message, 500);
    }
    return generateApiErrorResponse(
      "Hubo un error en la creacion del arqueo de caja",
      500
    );
  }
}

export async function GET() {
  const arqueosCaja = await prisma.arqueoDeCaja.findMany();
  return generateApiSuccessResponse(
    200,
    "Exito al obtener la lista de arqueo cajas",
    arqueosCaja
  );
}

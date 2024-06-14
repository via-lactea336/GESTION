import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";

import { Recibos } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body: Recibos = await req.json();

  const { clienteId, facturaId, totalPagado, movimientoId } = body;

  if (!clienteId || !facturaId || !totalPagado || !movimientoId)
    return generateApiErrorResponse(
      "Faltan datos para la creacion de el recibo",
      400
    );

  if (totalPagado.lessThanOrEqualTo(0))
    return generateApiErrorResponse(
      "El monto del recibo no puede ser menor o igual a 0",
      400
    );

  //Obtener la factura que se vera alterada para obtener el total de la factura y lo total pagado
  const verifyFactura = await prisma.factura.findUnique({
    where: {
      id: facturaId,
      clienteId: clienteId,
      esContado: false,
    },
    select: {
      total: true,
      totalSaldoPagado: true,
    },
  });

  if (!verifyFactura)
    return generateApiErrorResponse(
      "La factura a la que se hace referencia no existe",
      404
    );
  if (
    verifyFactura.totalSaldoPagado
      .add(totalPagado)
      .greaterThan(verifyFactura.total)
  )
    return generateApiErrorResponse(
      "El total que el cliente pagara no puede ser mayor que el total de la factura",
      400
    );

  try {
    const recibo = await prisma.recibos.create({
      data: {
        movimientoId,
        clienteId,
        facturaId,
        totalPagado: totalPagado,
        fechaEmision: new Date(),
      },
    });

    if (!recibo)
      return generateApiErrorResponse("Error generando el recibo", 400);

    //Actualizar el total de la factura
    const updateFactura = await prisma.factura.update({
      where: {
        id: facturaId,
      },
      data: {
        totalSaldoPagado: verifyFactura.totalSaldoPagado.add(totalPagado),
      },
    });

    if (!updateFactura)
      return generateApiErrorResponse(
        "Error actualizando el total de la factura",
        400
      );

    return generateApiSuccessResponse(
      200,
      "El recibo fue generada correctamente"
    );
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002")
      return generateApiErrorResponse("El recibo ya existe", 400);
    else
      return generateApiErrorResponse(
        "Hubo un error en la creacion de el recibo",
        500
      );
  }
}

export async function GET() {
  const recibos = await prisma.recibos.findMany({
    orderBy:{
      fechaEmision:"desc",
    }
  });
  return generateApiSuccessResponse(
    200,
    "Exito al obtener la lista de recibos",
    recibos
  );
}

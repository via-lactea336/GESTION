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

import { Comprobante } from "@prisma/client";
import verifyUser from "@/lib/auth/verifyUser";

export async function POST(req: NextRequest) {
  const body: Comprobante & { username: string; password: string } =
    await req.json();

  const { concepto, monto, movimientoId, username, password } = body;

  if (!monto || !concepto || !username || !password || !movimientoId)
    return generateApiErrorResponse(
      "Faltan datos para la creacion de el comprobante",
      400
    );

  if (new Decimal(monto).lessThanOrEqualTo(0))
    return generateApiErrorResponse("El monto debe ser mayor a 0", 400);

  try {
    const user = await verifyUser(username, password, "ADMIN");

    const comprobante = await prisma.comprobante.create({
      data: {
        concepto,
        monto,
        userId: user.id,
        movimientoId,
        fechaEmision: new Date(),
      },
    });

    if (!comprobante)
      return generateApiErrorResponse("Error generando el comprobante", 400);

    return generateApiSuccessResponse(
      200,
      "El comprobante fue generada correctamente"
    );
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002")
      return generateApiErrorResponse("el comprobante ya existe", 400);
    else if (err instanceof Error)
      return generateApiErrorResponse(err.message, 500);
    else
      return generateApiErrorResponse(
        "Hubo un error en la creacion de el comprobante",
        500
      );
  }
}

export async function GET() {
  const comprobantes = await prisma.comprobante.findMany();
  return generateApiSuccessResponse(
    200,
    "Exito al obtener la lista de comprobantes",
    comprobantes
  );
}

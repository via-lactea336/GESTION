import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";

import { AperturaCaja } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body: AperturaCaja = await req.json();
  const { cajaId, cajeroId, apertura, saldoInicial } = body;

  if (!cajaId || !cajeroId || !apertura || !saldoInicial)
    return generateApiErrorResponse(
      "Faltan datos para la apertura de caja",
      400
    );

  try {

    const aperturaCaja = await prisma.$transaction(async (tx) => {
      const aperturaTx = await tx.aperturaCaja.create({
        data: {
          cajaId,
          cajeroId,
          apertura,
          saldoInicial,
        },
        include:{
          caja:{
            select:{
              id:true,
              estaCerrado:true
            }
          }
        }
      })

      if(!aperturaTx.caja.estaCerrado) throw new Error("La caja no esta cerrada")

      const caja = await tx.caja.update({
        where: {
          id: cajaId,
        },
        data: {
          saldo: aperturaTx.saldoInicial,
          estaCerrado: false,
        },
      });

      if(!caja) throw new Error("Error actualizando la caja posterior a la apertura")
      
      return aperturaTx
    });

    return generateApiSuccessResponse(
      200,
      "La apertura de caja fue generada correctamente",
      [aperturaCaja]
    );
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002")
      return generateApiErrorResponse("La apertura de caja ya existe", 400);
    else
      return generateApiErrorResponse(
        "Hubo un error en la creacion de la apertura de caja",
        500
      );
  }
}

export async function GET() {
  const aperturasCaja = await prisma.aperturaCaja.findMany();
  return generateApiSuccessResponse(
    200,
    "Exito al obtener la lista de apertura de cajas",
    aperturasCaja
  );
}

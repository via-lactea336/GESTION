import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";

import { AperturaCaja } from "@prisma/client";
import ApiError from "@/lib/api/ApiError";

export async function POST(req: NextRequest) {
  const body: AperturaCaja = await req.json();
  const { cajaId, cajeroId, apertura, saldoInicial, observaciones } = body;

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
          observaciones
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

      if(!aperturaTx.caja.estaCerrado) throw new ApiError("La caja ya fue abierta", 400)

      const caja = await tx.caja.update({
        where: {
          id: cajaId,
        },
        data: {
          saldoEfectivo: aperturaTx.saldoInicial,
          saldoCheque:0,
          saldoTarjeta:0,
          estaCerrado: false,
        },
      });

      if(!caja) throw new ApiError("Error actualizando la caja posterior a la apertura", 500)
      
      return aperturaTx
    });

    return generateApiSuccessResponse(
      200,
      "La apertura de caja fue generada correctamente",
      [aperturaCaja]
    );
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002")return generateApiErrorResponse("La apertura de caja ya existe", 400);
    if(err instanceof ApiError) return generateApiErrorResponse(err.message, err.status);
    if(err instanceof Error) return generateApiErrorResponse(err.message, 500)
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

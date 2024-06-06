import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {Decimal, PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { Movimiento, MovimientoDetalle } from "@prisma/client";
import reflejarMovimiento from "@/lib/moduloCaja/movimiento/reflejarMovimiento";
import pagarFactura from "@/lib/moduloCaja/factura/pagarFactura";

export async function POST(req: NextRequest) {
  
  const body:{ mov:Movimiento, movsDetalles?:MovimientoDetalle[] }= await req.json();
  const { 
    mov,
    movsDetalles,
   } = body;
  if(!mov || !movsDetalles) return generateApiErrorResponse("Faltan datos para el movimiento", 400)
  if(movsDetalles.length === 0) return generateApiErrorResponse("Faltan los detalles del movimiento", 400)
  
  const montoDecimal = new Decimal(mov.monto)
  
  if(montoDecimal.lessThanOrEqualTo(0)) return generateApiErrorResponse("El monto debe ser mayor a 0", 400)
  
  try{
    const movimiento = await prisma.movimiento.create({
      data: {
        monto: mov.monto,
        facturaId: mov.facturaId,
        aperturaId: mov.aperturaId,
        esIngreso: mov.esIngreso,
      },
      include: {
        apertura: {
          include: {
            caja: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!movimiento)
      return generateApiErrorResponse("Error generando el movimiento", 400);

    if(movsDetalles){
      const sum = movsDetalles.reduce(
        (total, m) => total + (+m.monto),
        0
      )
      if(movimiento.monto.greaterThan(sum)) return generateApiErrorResponse("La suma de los movimientos detalle no coincide con el monto del movimiento", 400)
      await prisma.movimientoDetalle.createMany({
        data: movsDetalles.map((m) => ({ ...m, movimientoId: movimiento.id })),
        skipDuplicates: true,
      });
    }

    if(movimiento.facturaId) await pagarFactura(movimiento.facturaId, mov.monto)

    //Reflejar el movimiento en el saldo de la caja
    await reflejarMovimiento(
      movimiento.apertura.caja.id,
      mov.monto,
      mov.esIngreso
    );

    return generateApiSuccessResponse(
      200,
      "El movimiento fue generada correctamente"
    );
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002")
      return generateApiErrorResponse("El movimiento ya existe", 400);
    else if (err instanceof Error) console.log(err.message);
    return generateApiErrorResponse(
      "Hubo un error en la creacion del movimiento",
      500
    );
  }
}

export async function GET() {
  const movimiento = await prisma.movimiento.findMany();
  return generateApiSuccessResponse(
    200,
    "Exito al obtener los movimientos",
    movimiento
  );
}

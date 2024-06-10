import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";

import { Movimiento, MovimientoDetalle, Recibos } from "@prisma/client";
import reflejarMovimiento from "@/lib/moduloCaja/movimiento/reflejarMovimiento";
import pagarFactura from "@/lib/moduloCaja/factura/pagarFactura";
import verifyUser from "@/lib/auth/verifyUser";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ApiError from "@/lib/api/ApiError";

export async function POST(req: NextRequest) {
  try {
    const body: {
      mov: Movimiento;
      movsDetalles?: MovimientoDetalle[];
      username?: string;
      password?: string;
      concepto?: string;
    } = await req.json();
    const { mov, movsDetalles, username, password, concepto } = body;

    if (!mov || !movsDetalles || mov.esIngreso === undefined || !mov.monto || !mov.aperturaId)
      return generateApiErrorResponse("Faltan datos para el movimiento", 400);

    if (movsDetalles.length === 0) {
      return generateApiErrorResponse(
        "Faltan los detalles del movimiento",
        400
      );
    }

    const montoDecimal = new Decimal(mov.monto);

    if (montoDecimal.lessThanOrEqualTo(0)) {
      return generateApiErrorResponse("El monto debe ser mayor a 0", 400);
    }

    const sum = movsDetalles.reduce((total, m) => total + +m.monto, 0);

    if (sum !== +mov.monto) {
      throw new ApiError(
        "La suma de los montos detallados no coincide con el monto total del movimiento", 400
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      let reciboTx:Recibos | null = null
      const movimientoTx = await tx.movimiento.create({
        data: {
          monto: mov.monto,
          facturaId: mov.facturaId,
          aperturaId: mov.aperturaId,
          esIngreso: mov.esIngreso,
        },
        select: {
          esIngreso: true,
          id: true,
          factura: {
            select: {
              id: true,
              clienteId: true,
              esContado: true,
              totalSaldoPagado: true,
              total:true
            },
          },
          apertura: {
            include: {
              caja: {
                select: {
                  id: true,
                  saldoEfectivo: true,
                },
              },
            },
          },
        },
      });
      if (!movimientoTx) throw new Error("Error generando el movimiento");

      //Si es egreso, crear un comprobante
      if (!movimientoTx.esIngreso) {
        if (movimientoTx.apertura.caja.saldoEfectivo.lessThan(sum))
          throw new ApiError(
            "El monto que se desea extraer excede al saldo de la caja", 400
          );
        if (!username || !password)
          throw new ApiError("Faltan credenciales para crear el comprobante", 400);
        if (!concepto)
          throw new ApiError("Falta el concepto para crear el comprobante", 400);

        const user = await verifyUser(username, password, "ADMIN");

        await tx.comprobante.create({
          data: {
            movimientoId: movimientoTx.id,
            userId: user.id,
            monto: mov.monto,
            concepto: concepto,
            fechaEmision: new Date(),
          },
        });
      //Ingreso
      }else{
        //Para el ingreso se debe existir una factura 
        if(!movimientoTx.factura) throw new ApiError("No existe la factura", 400);

        //Si la factura es a credito, entonces se genera un recibo
        if (!movimientoTx.factura.esContado) {
          reciboTx = await tx.recibos.create({
            data: {
              clienteId: movimientoTx.factura.clienteId,
              totalPagado: mov.monto,
              facturaId: movimientoTx.factura.id,
              fechaEmision: new Date(),
            },
          });
        }

        //Si es egreso, pagar la factura
        await pagarFactura(tx, movimientoTx.factura.totalSaldoPagado, movimientoTx.factura.total, movimientoTx.factura.id, mov.monto);
      }

      //Se generan los movimientos detalles
      await tx.movimientoDetalle.createMany({
        data: movsDetalles.map((m) => ({
          ...m,
          movimientoId: movimientoTx.id,
        })),
        skipDuplicates: true,
      });

      //Se refleja el movimiento dentro de la caja
      await reflejarMovimiento(
        tx,
        movimientoTx.apertura.caja.id,
        movsDetalles,
        mov.esIngreso
      );

      return {movimientoTx, reciboTx};
    }, {
      maxWait: 6000,
      timeout: 6000
    });

    return generateApiSuccessResponse(
      200,
      "El movimiento fue generado correctamente",
      {recibo: result.reciboTx}
    );
  } catch (err) {
    console.error(err);
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return generateApiErrorResponse("El movimiento ya existe", 400);
    }if(err instanceof ApiError) {
      return generateApiErrorResponse(err.message, err.status); 
    }else {
      return generateApiErrorResponse(
        "Hubo un error en la creación del movimiento",
        500
      );
    }
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
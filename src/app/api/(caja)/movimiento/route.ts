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
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ApiError from "@/lib/api/ApiError";
import crearComprobanteDesdeMovimiento from "@/lib/moduloCaja/comprobante/services/crearComprobanteDesdeMovimiento";
import generarReciboDeMovimiento from "@/lib/moduloCaja/recibo/services/generarReciboDeMovimiento";
import calcularSaldosMovimiento from "@/lib/moduloCaja/movimiento/calcularSaldosMovimiento";

export async function POST(req: NextRequest) {

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

  movsDetalles.forEach((m) => {
    if (!m.metodoPago || !m.monto) return generateApiErrorResponse("Faltan detalles del movimiento", 400);
  });

  const montoDecimal = new Decimal(mov.monto);

  if (montoDecimal.lessThanOrEqualTo(0)) {
    return generateApiErrorResponse("El monto debe ser mayor a 0", 400);
  }

  const { sumSaldoEfectivo, sumSaldoCheque, sumSaldoTarjeta } = calcularSaldosMovimiento(movsDetalles)
  const sum = sumSaldoEfectivo + sumSaldoCheque + sumSaldoTarjeta

  if (sum !== +mov.monto) return generateApiErrorResponse("La suma de los montos diferentes metodos de pago no coincide con el monto total del movimiento", 400);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const movimientoTx = await tx.movimiento.create({
        data: {
          monto: mov.monto,
          facturaId: mov.facturaId,
          aperturaId: mov.aperturaId,
          esIngreso: mov.esIngreso,
        },
        select: {
          id: true,
          factura: {
            select: {
              id: true,
              clienteId: true,
              esContado: true,
              totalSaldoPagado: true,
              total: true
            },
          },
          apertura: {
            select: {
              saldoInicial: true,
              caja: {
                select: {
                  id: true,
                  saldoEfectivo: true,
                  saldoCheque: true,
                  saldoTarjeta: true,
                },
              },
            },
          },
        },
      });

      if(movimientoTx.factura?.esContado && movimientoTx.factura.total.greaterThan(sum)) throw new ApiError("Una factura al contado debe pagarse en su totalidad con un movimiento", 400)

      if(
        !mov.esIngreso &&
        (movimientoTx.apertura.caja.saldoEfectivo.lessThan(sumSaldoEfectivo)
        || movimientoTx.apertura.caja.saldoCheque.lessThan(sumSaldoCheque)
        || movimientoTx.apertura.caja.saldoTarjeta.lessThan(sumSaldoTarjeta))
      ) throw new ApiError("Saldo insuficiente para realizar el movimiento", 400)


      if(mov.esIngreso && movimientoTx.factura) {
        await pagarFactura(tx, movimientoTx.factura.totalSaldoPagado, movimientoTx.factura.total, movimientoTx.factura?.id, new Decimal(sum))
      }

      return movimientoTx;
    });

    if(!result) throw new ApiError("No se pudo registrar el movimiento", 500)

    //Se refleja el movimiento dentro de la caja
    await reflejarMovimiento(
      result.apertura.caja.id,
      sumSaldoEfectivo,
      sumSaldoCheque,
      sumSaldoTarjeta,
      mov.esIngreso
    );

    //Se generan los movimientos detalles
    await prisma.movimientoDetalle.createMany({
      data: movsDetalles.map((m) => ({
        ...m,
        movimientoId: result.id,
      })),
      skipDuplicates: true,
    });

    let recibo:Recibos|null = null

    //Si es egreso, crear un comprobante
    if (!mov.esIngreso) crearComprobanteDesdeMovimiento(result.id, result.apertura.saldoInicial, sum, username, password, concepto);
    else{ //Si es ingreso, generar un recibo
      if (!result.factura) throw new ApiError("No se pudo crear el recivo debido a que la factura no existe", 404)
      recibo = await generarReciboDeMovimiento(sum, result.factura.id, result.factura.clienteId)
    }

    return generateApiSuccessResponse(
      200,
      "El movimiento fue generado correctamente",
      { recibo: recibo }
    );
  } catch (err) {
    console.error(err);
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return generateApiErrorResponse("El movimiento ya existe", 400);
    } if (err instanceof ApiError) {
      return generateApiErrorResponse(err.message, err.status);
    } else {
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
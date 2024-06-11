import { Factura, Movimiento } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api/ApiError";

const generarReciboDeMovimiento = async (
  monto:number,
  facturaId:string,
  clienteId:string,
) => {

  const recibo = await prisma.recibos.create({
    data: {
      clienteId: clienteId,
      totalPagado: monto,
      facturaId: facturaId,
      fechaEmision: new Date(),
    },
  });

  return recibo;
}

export default generarReciboDeMovimiento
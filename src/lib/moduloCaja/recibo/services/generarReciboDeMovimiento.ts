import prisma from "@/lib/prisma";

const generarReciboDeMovimiento = async (
  movimientoId:string,
  monto:number,
  facturaId:string,
  clienteId:string,
) => {

  const recibo = await prisma.recibos.create({
    data: {
      movimientoId,
      clienteId: clienteId,
      totalPagado: monto,
      facturaId: facturaId,
      fechaEmision: new Date(),
    },
  });

  return recibo;
}

export default generarReciboDeMovimiento
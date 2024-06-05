import prisma from "../prisma";

export default async function cerrarCaja(aperturaId:string, observaciones?:string) {
  const aperturaCaja = await prisma.aperturaCaja.update({
      where: {
        id: aperturaId
      },
      data: {
        cierreCaja: new Date()
      },
      select: {
        cajaId: true
      }
  })
  const caja = await prisma.caja.update({
      where: {
        id: aperturaCaja.cajaId
      },
      data: {
        estaCerrado: true
      }
  })
  if(!aperturaCaja || !caja) throw new Error("Error cerrando la caja");
}
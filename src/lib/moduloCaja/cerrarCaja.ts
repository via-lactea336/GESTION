import prisma from "../prisma";
import calcularDatosRegistroCaja from "./resumenDiario";


export default async function cerrarCaja(aperturaId: string, observaciones?: string) {
  const aperturaCaja = await prisma.aperturaCaja.update({
    where: {
      id: aperturaId,
    },
    data: {
      observaciones,
      cierreCaja: new Date(),
    },
    select: {
      cajaId: true,
    }
  });
  const caja = await prisma.caja.update({
    where: {
      id: aperturaCaja.cajaId,
    },
    data: {
      estaCerrado: true,
    },
  });
  if (!aperturaCaja || !caja) throw new Error("Error cerrando la caja y la apertura de caja")
  await calcularDatosRegistroCaja(aperturaId)
}
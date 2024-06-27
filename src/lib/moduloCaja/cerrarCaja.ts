import ApiError from "../api/ApiError";
import prisma from "../prisma";
import calcularDatosRegistroCaja from "./resumenDiario/calcularResumenDiario";

export default async function cerrarCaja(aperturaId: string, observaciones?: string) {

  prisma.$transaction(async (tx) => {
    const aperturaCaja = await tx.aperturaCaja.update({
      where: {
        id: aperturaId,
      },
      data: {
        observaciones,
        cierreCaja: new Date(),
      },
      select: {
        cajaId: true,
        arqueo: {
          select: {
            id: true
          }
        },
      }
    });

    if (!aperturaCaja) throw new ApiError("Error cerrando la caja", 500)
    if (!aperturaCaja.arqueo || !aperturaCaja.arqueo.id) throw new ApiError("No existe un arqueo de caja asociado a esta apertura",500)

    const arqueo = await tx.arqueoDeCaja.update({
      where: {
        id: aperturaCaja.arqueo.id
      },
      data: {
        observaciones,
      }
    })

    const caja = await tx.caja.update({
      where: {
        id: aperturaCaja.cajaId,
      },
      data: {
        estaCerrado: true,
      },
    });
    if (!aperturaCaja || !caja || !arqueo) throw new ApiError("Error cerrando la caja", 500)
  }, {
    maxWait: 10000,
    timeout: 10000
  })
  await calcularDatosRegistroCaja(aperturaId)
}
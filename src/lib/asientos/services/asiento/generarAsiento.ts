import prisma from "@/lib/prisma"

type GenerarAsientoParams = {
  codigo: string,
  concepto: string,
  monto: number,
  esDebe: boolean,
  esAsentable: boolean,
  fecha?: Date,
}

/**
 * Permite generar asientos
 * @param asientos El conjunto de datos necesarios para generar un asiento
 * @returns El asiento en cuestion
 */
const generarAsiento = async (asientos: GenerarAsientoParams[]) => {
  const createdAsientos = await prisma.$transaction(async (tx) => {
    const createdAsientos = []

    for (const asientoParams of asientos) {
      // Crear un nuevo asiento
      const newAsiento = await tx.asiento.create({
        data: {
          fecha: asientoParams.fecha || new Date(),
          descripcion: asientoParams.concepto,
          detalles: {
            create: {
              esDebe: asientoParams.esDebe,
              monto: asientoParams.monto,
              cuenta: {
                connect: {
                  codigo: asientoParams.codigo,
                },
              },
            },
          },
        },
        include: {
          detalles: true,
        },
      })

      createdAsientos.push(newAsiento)
    }

    return createdAsientos
  })

  return createdAsientos
}

export default generarAsiento
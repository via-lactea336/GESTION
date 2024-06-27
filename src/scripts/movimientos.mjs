import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



async function main() {
  // Obtener las 12 facturas más viejas
  const facturas = await prisma.factura.findMany({
    take: 12,
    orderBy: {
      fechaEmision: "asc",
    },
  });

  for (const factura of facturas) {
    const apertura = await prisma.aperturaCaja.create({
        data: {
            saldoInicial: 10000,
            apertura: factura.fechaEmision,
            cierreCaja: factura.fechaEmision,
            cajaId: "604bf7c9-80b8-49d0-9e6a-142770d3893f",
            cajeroId: "422b3dd6-01b9-4d98-ad72-2953bfb8b3f5",
            observaciones: "Apertura de prueba",
            createdAt: factura.fechaEmision,
            
        }
    })
    const arqueo = await prisma.arqueoDeCaja.create({
        data: {
            aperturaId: apertura.id,
            montoRegistrado: `${10000 + Number(factura.total)}`,
            montoEsperado: `${10000 + Number(factura.total)}`,
            createdAt: factura.fechaEmision,
        }
    })

    const registro = await prisma.registroCaja.create({
        data: {
            aperturaId: apertura.id,
            montoRegistrado: `${10000 + Number(factura.total)}`,
            montoEsperado: `${10000 + Number(factura.total)}`,
            montoInicial: 10000,
            cantCheques: 0,
            cantTarjetas: 0,
            montoIngresoCheque: 0,
            montoIngresoTarjeta: 0,
            montoEgresoTotal: 0,
            montoIngresoEfectivo: factura.total,
            montoIngresoTotal: factura.total,
            createdAt: factura.fechaEmision,
        }
    })

    const response = await prisma.movimiento.create({
        data: {
            aperturaId: apertura.id,
            esIngreso: true,
            monto: factura.total,
            facturaId: factura.id,
            movimientoDetalles: {
              create: [
                {
                  metodoPago: "EFECTIVO",
                  monto: factura.total,
                  concepto: "Pago en efectivo",
                },
              ],
            },
          },
        });
  }

  const facturasPagas = await prisma.factura.findMany({
    take: 12,
    orderBy: {
      fechaEmision: "asc",
    },
  });

  // Modificar las fechas de las facturas, movimientos y detalles
  for (const factura of facturasPagas) {
    const pagado = factura.fechaEmision;

    await prisma.$transaction([
      prisma.factura.update({
        where: {
          id: factura.id,
        },
        data: {
          pagado,
          totalSaldoPagado: factura.total,
        },
      }),
      prisma.movimiento.updateMany({
        where: {
          facturaId: factura.id,
        },
        data: {
          createdAt: pagado,
          updatedAt: pagado,
        },
      }),
      prisma.movimientoDetalle.updateMany({
        where: {
          movimiento: {
            facturaId: factura.id,
          },
        },
        data: {
          createdAt: pagado,
          updatedAt: pagado,
        },
      }),
    ]);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

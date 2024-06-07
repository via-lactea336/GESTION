import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function calcularDatosRegistroCaja(aperturaId: string) {
  // Obtener la apertura de caja con todos sus movimientos y detalles de movimientos
  const apertura = await prisma.aperturaCaja.findUnique({
    where: { id: aperturaId },
    include: {
      movimiento: {
        include: {
          movimientoDetalles: true
        }
      }
    }
  })

  if (!apertura) {
    throw new Error('Apertura de caja no encontrada')
  }

  let montoIngreso = 0
  let montoEgreso = 0
  let montoIngresoCheque = 0
  let montoEgresoCheque = 0
  let montoIngresoTarjeta = 0
  let montoEgresoTarjeta = 0
  let cantCheques = 0
  let cantTarjetas = 0

  apertura.movimiento.forEach(movimiento => {
    const esIngreso = movimiento.esIngreso

    movimiento.movimientoDetalles.forEach(detalle => {
      const { monto, metodoPago } = detalle

      if (esIngreso) {
        montoIngreso += monto.toNumber()

        if (metodoPago === 'CHEQUE') {
          montoIngresoCheque += monto.toNumber()
          cantCheques++
        } else if (metodoPago === 'TARJETA') {
          montoIngresoTarjeta += monto.toNumber()
          cantTarjetas++
        }
      } else {
        montoEgreso += monto.toNumber()

        if (metodoPago === 'CHEQUE') {
          montoEgresoCheque += monto.toNumber()
        } else if (metodoPago === 'TARJETA') {
          montoEgresoTarjeta += monto.toNumber()
        }
      }
    })
  })

  const montoInicial = apertura.saldoInicial.toNumber()
  const montoRegistrado = montoInicial + montoIngreso - montoEgreso
  const montoEsperado = montoInicial + montoIngreso - montoEgreso

  // Crear la instancia de RegistroCaja
  const registroCaja = await prisma.registroCaja.create({
    data: {
      aperturaId: apertura.id,
      montoRegistrado: montoRegistrado,
      montoEsperado: montoEsperado,
      montoInicial: montoInicial,
      cantCheques: cantCheques,
      cantTarjetas: cantTarjetas,
      montoIngreso: montoIngreso,
      montoEgreso: montoEgreso,
      montoIngresoCheque: montoIngresoCheque,
      montoEgresoCheque: montoEgresoCheque,
      montoIngresoTarjeta: montoIngresoTarjeta,
      montoEgresoTarjeta: montoEgresoTarjeta,
    }
  })

  if(!registroCaja) throw new Error('Error creando el registro de caja')

}
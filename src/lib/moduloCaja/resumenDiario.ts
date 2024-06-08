import prisma from "../prisma"
import ApiError from "../api/ApiError"

export default async function calcularDatosRegistroCaja(aperturaId: string) {
  // Obtener la apertura de caja con todos sus movimientos y detalles de movimientos
  const apertura = await prisma.aperturaCaja.findUnique({
    where: { id: aperturaId },
    include: {
      arqueo:{
          select:{
            montoEsperado:true,
            montoRegistrado:true,
            observaciones:true
          }
      },
      movimiento: {
        include: {
          movimientoDetalles: true,
        }
      }
    }
  })

  if (!apertura) throw new ApiError('Apertura de caja no encontrada', 404)

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
        montoIngreso += metodoPago === 'EFECTIVO' ? monto.toNumber() : 0

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
      //Apertura de caja
      aperturaId: apertura.id,

      //Monto que se registro en el arqueo de caja
      montoRegistrado: montoRegistrado,

      //Monto que se calcula de todos los movimientos de caja
      montoEsperado: montoEsperado,

      //Monto con el que se abrio la caja
      montoInicial: montoInicial,

      //Cant de cheques en la apertura de caja
      cantCheques: cantCheques,

      //Cant de tarjetas en la apertura de caja
      cantTarjetas: cantTarjetas,

      //Monto de ingreso en efectivo de la caja 
      montoIngreso: montoIngreso,

      //Monto de egreso en efectivo de la caja
      montoEgreso: montoEgreso,

      montoIngresoCheque: montoIngresoCheque,
      montoIngresoTarjeta: montoIngresoTarjeta,
    }
  })

  if(!registroCaja) throw new ApiError('Error creando el registro de caja', 500)

}
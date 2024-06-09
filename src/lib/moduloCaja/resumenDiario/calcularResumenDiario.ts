import prisma from "../../prisma"
import ApiError from "../../api/ApiError"

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
  if (!apertura.arqueo) throw new ApiError('No se puede realizar el registro diario sin que haya un arqueo de la caja', 404)

  let montoEgresoTotal = 0
  let montoIngresoTotal = 0

  let montoIngresoEfectivo = 0
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
        
        montoIngresoTotal += monto.toNumber()

        switch (metodoPago) {
          case 'EFECTIVO':
            montoIngresoEfectivo += monto.toNumber()
            break
          case 'CHEQUE':
            montoIngresoCheque += monto.toNumber()
            cantCheques++
            break
          case 'TARJETA':
            montoIngresoTarjeta += monto.toNumber()
            cantTarjetas++
            break
          default:
            break
        }
        
      } else {
        montoEgresoTotal += monto.toNumber()
        if (metodoPago === 'CHEQUE') {
          montoEgresoCheque += monto.toNumber()
        } else if (metodoPago === 'TARJETA') {
          montoEgresoTarjeta += monto.toNumber()
        }
      }
    })
  })

  const montoInicial = apertura.saldoInicial.toNumber()
  const montoRegistrado = apertura.arqueo.montoRegistrado.toNumber()
  const montoEsperado = montoInicial + montoIngresoEfectivo - montoEgresoTotal

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

      //Cant de cheques y tarjetas en la apertura de caja
      cantCheques: cantCheques,
      cantTarjetas: cantTarjetas,

      //Monto de ingreso en efectivo de la caja 
      montoIngresoEfectivo: montoIngresoEfectivo,

      //Monto de Ingreso y egreso Total de la caja
      montoEgresoTotal: montoEgresoTotal,
      montoIngresoTotal: montoIngresoEfectivo,

      //Monto de ingresos en cheques y tarjetas
      montoIngresoCheque: montoIngresoCheque,
      montoIngresoTarjeta: montoIngresoTarjeta,
    }
  })

  if(!registroCaja) throw new ApiError('Error creando el registro de caja', 500)

}
import { MovimientoDetalle } from "@prisma/client"

export default function calcularSaldosMovimiento(
  movs: MovimientoDetalle[],
){

  let sumSaldoEfectivo = 0
  let sumSaldoCheque = 0
  let sumSaldoTarjeta = 0

  movs.forEach(mov => {
    switch (mov.metodoPago) {
      case 'EFECTIVO':
        sumSaldoEfectivo += +mov.monto
        break
      case 'CHEQUE':
        sumSaldoCheque += +mov.monto
        break
      case 'TARJETA':
        sumSaldoTarjeta += +mov.monto
        break
      default:
        break
    }
  })

  return { sumSaldoEfectivo, sumSaldoCheque, sumSaldoTarjeta }

}
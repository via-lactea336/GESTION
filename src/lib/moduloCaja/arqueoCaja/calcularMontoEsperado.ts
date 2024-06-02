import prisma from "@/lib/prisma";

/**
 * Permite calcular el monto esperado mediante los movimientos de la apertura de caja.
 * @param aperturaId Es el ID de la apertura de Caja
 * @returns El monto esperado segun los movimientos de la caja
 */
export default async function calcularMontoEsperado(aperturaId:string){
  
  const apertura = await prisma.aperturaCaja.findUnique({
    where:{
      id:aperturaId,
    },
    select:{
      saldoInicial:true
    }
  })

  if(!apertura) throw new Error("No se encontro la apertura relacionada a su cierre de caja")

  const movs = await prisma.movimiento.findMany({
    where:{
      aperturaId:aperturaId
    },
    include:{
      movimientoDetalles: true
    }
  })

  if(!movs) throw new Error("No se pudieron encontrar los movimientos ligados a su apertura de caja")

  let sum = +apertura.saldoInicial;

  movs.forEach((mov) => {
    sum += mov.movimientoDetalles.reduce((total, movDet) => {
      if (movDet.metodoPago === 'EFECTIVO') {
        return total + (mov.esIngreso ? +movDet.monto : -movDet.monto);
      }else return total + 0
    }, 0)
  })

  return sum
}
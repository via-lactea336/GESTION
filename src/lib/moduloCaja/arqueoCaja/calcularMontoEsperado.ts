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
    }
  })

  if(!movs) throw new Error("No se pudieron encontrar los movimientos ligados a su apertura de caja")

  //La sumatoria de montos, negativo y positivo
  const sum = movs.reduce(
    (total, mov) => {
      if(mov.esIngreso){
        return total + (+mov.monto)
      }else{
        return total + (-1 * +mov.monto)
      }
    }, Number(apertura.saldoInicial))

  return sum
}
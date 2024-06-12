import prisma from "@/lib/prisma";

export default async function reflejarMovimiento(
  cajaId:string, 
  sumSaldoEfectivo:number, 
  sumSaldoCheque:number, 
  sumSaldoTarjeta:number,
  esIngreso:boolean
) {

  await prisma.caja.update({
    where:{
      id: cajaId
    },
    data:{
      saldoEfectivo: sumSaldoEfectivo > 0 ? esIngreso? {increment: sumSaldoEfectivo} : {decrement: sumSaldoEfectivo} : undefined,
      saldoCheque: sumSaldoCheque > 0 ? esIngreso? {increment: sumSaldoCheque} : {decrement: sumSaldoCheque} : undefined,
      saldoTarjeta: sumSaldoTarjeta > 0 ? esIngreso? {increment: sumSaldoTarjeta} : {decrement: sumSaldoTarjeta} : undefined
    }
  })

}
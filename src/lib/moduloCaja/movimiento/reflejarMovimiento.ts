import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";

export default async function reflejarMovimiento(cajaId:string, monto:Decimal, esIngreso:boolean) {

  const cajaVerif = await prisma.caja.findUnique({
    where:{
      id: cajaId
    },
    select:{
      saldo:true
    }
  })

  if(!cajaVerif) throw new Error("Caja no encontrada")

  if(!esIngreso && cajaVerif.saldo.lessThan(monto)) throw new Error("Saldo insuficiente para realizar el movimiento")

  const newSaldo = {
    decrement: !esIngreso ? monto : undefined,
    increment: esIngreso ? monto : undefined
  }

  await prisma.caja.update({
    where:{
      id: cajaId
    },
    data:{
      saldo: newSaldo
    }
  })

}
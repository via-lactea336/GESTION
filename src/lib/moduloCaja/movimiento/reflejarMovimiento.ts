import prisma from "@/lib/prisma";
import { MovimientoDetalle, Prisma } from "@prisma/client";
import calcularSaldosMovimiento from "./calcularSaldosMovimiento";
import ApiError from "@/lib/api/ApiError";

export default async function reflejarMovimiento(tx:Prisma.TransactionClient, cajaId:string, movsDetalles:MovimientoDetalle[], esIngreso:boolean) {

  const { sumSaldoEfectivo, sumSaldoCheque, sumSaldoTarjeta } = calcularSaldosMovimiento(movsDetalles)

  const cajaVerif = await tx.caja.findUnique({
    where:{
      id: cajaId
    },
    select:{
      saldoEfectivo:true,
      saldoCheque:true,
      saldoTarjeta:true
    }
  })

  console.log(sumSaldoCheque, sumSaldoEfectivo, sumSaldoTarjeta)

  if(!cajaVerif) throw new ApiError("Caja no encontrada", 404)

  if(
    !esIngreso &&
    (cajaVerif.saldoEfectivo.lessThan(sumSaldoEfectivo)
    || cajaVerif.saldoCheque.lessThan(sumSaldoCheque)
    || cajaVerif.saldoTarjeta.lessThan(sumSaldoTarjeta))
  ) throw new ApiError("Saldo insuficiente para realizar el movimiento", 400)


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
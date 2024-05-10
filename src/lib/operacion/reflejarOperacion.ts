import { Decimal } from "@prisma/client/runtime/library"
import prisma from "../prisma"

const reflejarOperacion = async (idCuentaBancariaOrigen: string, monto: Decimal, tipoOperacionId:string) => {
  
  const cuentaBancariaVerif = await prisma.cuentaBancaria.findUnique({
    where:{
      id: idCuentaBancariaOrigen
    }
  })

  const tipoOperacion = await prisma.tipoOperacion.findFirst({
    where:{
      id: tipoOperacionId
    }
  })

  if(!tipoOperacion) throw new Error("No existe el tipo de Operacion ingresado")

  const esDebito = tipoOperacion.esDebito
  const afectaSaldo = tipoOperacion.afectaSaldo

  if(esDebito && afectaSaldo && (Number(cuentaBancariaVerif?.saldoDisponible) - Number(monto)) <= 0) throw new Error("Saldo disponible insuficiente para realizar la operacion")
  if(esDebito && (Number(cuentaBancariaVerif?.saldo) - Number(monto)) <= 0) throw new Error("Saldo retenido insuficiente para realizar la operacion")

  //Verificar si se da debito o credito a nuestra cuenta
  const saldoNuevo = {
    decrement: esDebito === true ? monto : undefined,
    increment: esDebito === false ? monto : undefined
  }

  //Aumenta o decrece el saldo total de nuestra cuenta bancaria
  await prisma.cuentaBancaria.update({
    where: {
      id: idCuentaBancariaOrigen
    },
    data: {
      saldo: saldoNuevo,
      //Si afectaSaldo, entonces se afecta al saldo disponible con el caso (credito = increment o debito = decrement) y el monto especificado
      saldoDisponible: afectaSaldo ? saldoNuevo : undefined
    }
  })

}

export default reflejarOperacion
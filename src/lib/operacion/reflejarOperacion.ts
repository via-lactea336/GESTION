import { Decimal } from "@prisma/client/runtime/library"
import prisma from "../prisma"

const reflejarOperacion = async (idCuentaBancariaOrigen: string, monto: Decimal, afectaSaldo: boolean, esDebito: boolean) => {
  
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
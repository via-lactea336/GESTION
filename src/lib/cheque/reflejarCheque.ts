import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../prisma";

export default async function reflejarCheque (
  monto:Decimal, 
  cuentaBancariaAfectadaBancoId:string,
  cuentaAfectadaId:string,
  bancoChequeId:string,
  esRecibido:boolean
){

  //Verificar si se da debito o credito a nuestra cuenta
  const saldoNuevo = {
    increment: esRecibido === true ? Number(monto) : undefined, //Si es de credito, incrementa el saldo con el monto 
    decrement: esRecibido === false ? Number(monto) : undefined, //Si es de debito, decrementa el saldo con el monto 
  }
  
  console.log(saldoNuevo, esRecibido, monto, cuentaBancariaAfectadaBancoId, bancoChequeId)

  //En caso de que el cheque sea de un banco igual al de la cuenta afectada
  //Aumenta o decrece el saldo total de nuestra cuenta bancaria de forma automatica 
  await prisma.cuentaBancaria.update({
    where: {
      id: cuentaAfectadaId,
    },
    data: {
      saldo: saldoNuevo,
      //Si afectaSaldo, entonces se afecta al saldo disponible con el caso (credito = increment o debito = decrement) y el monto especificado
      saldoDisponible: cuentaBancariaAfectadaBancoId === bancoChequeId && esRecibido ? saldoNuevo : undefined,
    },
  })
}
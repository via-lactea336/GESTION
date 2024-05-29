import prisma from "../../prisma";
import { Decimal } from "@prisma/client/runtime/library";

const reflejarOperacion = async (
  idCuentaBancariaOrigen: string,
  monto: Decimal,
  esDebito:boolean,
  afectaSaldo:boolean,
  afectaSaldoDisponible:boolean
) => {
  
  //Verificar si se da debito o credito a nuestra cuenta
  const saldoNuevo = {
    decrement: esDebito === true ? monto : undefined,
    increment: esDebito === false ? monto : undefined,
  };

  //Aumenta o decrece los saldos de nuestra cuenta bancaria
  await prisma.cuentaBancaria.update({
    where: {
      id: idCuentaBancariaOrigen,
    },
    data: {
      saldo: afectaSaldo? saldoNuevo : undefined,
      saldoDisponible: afectaSaldoDisponible ? saldoNuevo : undefined,
    },
  });
};

export default reflejarOperacion;

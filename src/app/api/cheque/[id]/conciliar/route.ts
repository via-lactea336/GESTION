import { NextRequest } from "next/server";
import { estadoCheque } from "@prisma/client";
import prisma from "@/lib/prisma";
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  
  const id = params.id;
  
  const chequeVerifBefore = await prisma.cheque.findUnique({
    where: {
      id
    },
    include:{
      cuentaAfectada: true,
      bancoCheque: true
    }
  })

  if(!chequeVerifBefore) return generateApiErrorResponse("Cheque no encontrado", 404)
  if(chequeVerifBefore.estado === estadoCheque.PAGADO || chequeVerifBefore.fechaPago != null) return generateApiErrorResponse("Cheque ya fue pagado", 400)

  const { esRecibido, monto, fechaEmision, involucrado, estado, bancoChequeId, cuentaBancariaAfectadaId, cuentaAfectada, bancoCheque } = chequeVerifBefore

  if(!esRecibido && (Number(cuentaAfectada.saldo) < Number(monto) || Number(cuentaAfectada.saldoDisponible) < Number(monto))) return generateApiErrorResponse("Saldo insuficiente", 400)
  
  const saldoUpdate = {
    increment: esRecibido === true ? monto : undefined, //Si es recibido entonces incrementa el saldo con el monto 
    decrement: esRecibido === false ? monto : undefined, //Si no es recibido (emitido) entonces decrementa el saldo con el monto 
  }

  await prisma.cuentaBancaria.update({
    where: {
      id: cuentaBancariaAfectadaId
    },
    data: {
      saldoDisponible: saldoUpdate
    }
  })

  const cheque = await prisma.cheque.update({
    where: {
      id
    },
    data: {
      fechaPago: new Date(),
      estado: estadoCheque.PAGADO,
    }
  })

  return generateApiSuccessResponse(200, `Cheque n° ${cheque.numeroCheque} fue pagado`, cheque)

}
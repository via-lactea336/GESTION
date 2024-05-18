import { NextRequest } from "next/server";
import { estadoCheque } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const cheque = await prisma.cheque.update({
    where: {
      id:id,
      estado: estadoCheque.EMITIDO
    },
    data:{
      estado: estadoCheque.ANULADO
    },
    include:{
      cuentaAfectada:{
        include:{
          entidad:true
        }
      },
      bancoCheque:true
    }
  })

  if (!cheque)
    return generateApiErrorResponse("Cheque no encontrado", 404);

  const tipoOperacionId = await prisma.tipoOperacion.findUnique({
    where: {
      nombre: cheque.esRecibido? "ANULACION DE CHEQUE RECIBIDO" : "ANULACION DE CHEQUE EMITIDO"
    },
    select:{
      id: true
    }
  })

  if(!tipoOperacionId) return generateApiErrorResponse("Tipo de operacion para anulacion de cheque no encontrada", 404)

  // const newSaldoRetenido = {
  //   decrement: cheque.esRecibido === true ? cheque.monto : undefined, //Si fue recibido entonces decrementa el saldo igual al monto. 
  //   increment: cheque.esRecibido === false ? cheque.monto : undefined, //Si no es recibido (emitido) entonces incrementa el saldo igual el monto
  // }
  
  const operacion = await prisma.operacion.create({
    data: {
      bancoInvolucrado: cheque.bancoCheque.nombre,
      nombreInvolucrado: cheque.cuentaAfectada.entidad.nombre,
      rucInvolucrado: cheque.cuentaAfectada.entidad.ruc,
      cuentaInvolucrado: cheque.cuentaAfectada.numeroCuenta,
      concepto: "ANULACION DE CHEQUE",
      fechaOperacion: new Date(),
      cuentaBancariaOrigenId: cheque.bancoChequeId,
      monto: cheque.monto,
      tipoOperacionId: tipoOperacionId.id,
      numeroComprobante: cheque.numeroCheque,
    }
  })

  if(!operacion) return generateApiErrorResponse("Error creando la operacion para anular el cheque", 404)

  return generateApiSuccessResponse(
    200,
    `Cheque n° ${cheque.numeroCheque} fue anulado`,
    cheque
  );
}

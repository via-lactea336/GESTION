import { NextRequest } from "next/server";
import { estadoCheque } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const {bancoAfectadoId} : {bancoAfectadoId: string} = await req.json();
  const id = params.id;

  if(!bancoAfectadoId) return generateApiErrorResponse("No hay informacion suficiente para conciliar el cheque", 500);

    try{
      //Conciliar el cheque
      const cheque = await prisma.cheque.update({
        where: {
          id,
          estado: estadoCheque.EMITIDO,
        },
        data: {
          fechaPago: new Date(),
          estado: estadoCheque.PAGADO,
        },
      });

      const saldoUpdate = {
        increment: cheque.esRecibido === true ? cheque.monto : undefined, //Si es recibido entonces incrementa el saldo con el monto
        decrement: cheque.esRecibido === false ? cheque.monto : undefined, //Si no es recibido (emitido) entonces decrementa el saldo con el monto
      };

      //Actualizar el saldo de la cuenta
      await prisma.cuentaBancaria.update({
        where: {
          id: cheque.cuentaBancariaAfectadaId,
        },
        data: {
          saldoDisponible: saldoUpdate,
        },
      });

      if (!cheque) return generateApiErrorResponse("Cheque no encontrado", 404);
      
      return generateApiSuccessResponse(
        200,
        `Cheque n° ${cheque.numeroCheque} fue pagado`,
        cheque
      );
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError) return generateApiErrorResponse(err.message, 500);
    if(err instanceof Error) return generateApiErrorResponse(err.message, 500);
    return generateApiErrorResponse("Error al conciliar el cheque", 500);
  }
}

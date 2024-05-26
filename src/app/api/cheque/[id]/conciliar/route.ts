import { NextRequest } from "next/server";
import { estadoCheque } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import reflejarOperacion from "@/lib/operacion/reflejarOperacion";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const id = params.id;
  
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
      })

      if (!cheque) return generateApiErrorResponse("Cheque no encontrado", 404)

      const tipoOperacion = await prisma.tipoOperacion.findUnique({
        where: {
          nombre: "CONCILIACION DE CHEQUE",
        },select:{
          id: true,
          esDebito: true,
          afectaSaldo: true,
          afectaSaldoDisponible: true
        }
      });	

      if(!tipoOperacion) return generateApiErrorResponse("Tipo de operacion para conciliacion de cheque no encontrada", 404)

      const operacion = await prisma.operacion.create({
        data: {
          nombreInvolucrado: cheque.involucrado,
          concepto: "CONCILIACION DE CHEQUE",
          fechaOperacion: new Date(),
          cuentaBancariaOrigenId: cheque.cuentaBancariaAfectadaId,
          monto: cheque.monto,
          tipoOperacionId: tipoOperacion.id,
          numeroComprobante: cheque.numeroCheque,
        },
      });

      if (!operacion) return generateApiErrorResponse("Operacion no creada", 500)

      await reflejarOperacion(operacion.cuentaBancariaOrigenId, cheque.monto, tipoOperacion.esDebito, tipoOperacion.afectaSaldo, tipoOperacion.afectaSaldoDisponible);
      
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

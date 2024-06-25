import { NextRequest } from "next/server";
import { estadoCheque } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import reflejarOperacion from "@/lib/moduloBanco/operacion/reflejarOperacion";
import ApiError from "@/lib/api/ApiError";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const {bancoAfectadoId} : {bancoAfectadoId: string} = await req.json();

  try {
    const cheque = await prisma.$transaction(async (tx) => {
      const chequeTx = await tx.cheque.update({
        where: {
          id:id,
          bancoChequeId:{
            not:bancoAfectadoId
          },
          esRecibido:true
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

      if(chequeTx.fechaPago && chequeTx.fechaPago.toISOString().split('T')[0] > new Date().toISOString().split('T')[0]) throw new ApiError("El cheque no puede ser anulado antes de la fecha de pago.", 400)

      return chequeTx
    })

    if (!cheque)
      return generateApiErrorResponse("Cheque no encontrado", 404);
  
    const tipoOperacionId = await prisma.tipoOperacion.findUnique({
      where: {
        nombre: "Anulación de cheque"
      },
      select:{
        id: true
      }
    })
  
    if(!tipoOperacionId) return generateApiErrorResponse("Tipo de operacion para anulacion de cheque no encontrada", 404)
    
    const operacion = await prisma.operacion.create({
      data: {
        nombreInvolucrado: cheque.involucrado,
        concepto: "Anulación de cheque n° " + cheque.numeroCheque,
        fechaOperacion: new Date(),
        cuentaBancariaOrigenId: cheque.cuentaBancariaAfectadaId,
        monto: cheque.monto,
        tipoOperacionId: tipoOperacionId.id,
        numeroComprobante: cheque.numeroCheque,
      },
      include: {
        tipoOperacion: {
          select: {
            esDebito: true,
            afectaSaldo: true,
            afectaSaldoDisponible: true,
          }
        },
      }
    })

    await reflejarOperacion(operacion.cuentaBancariaOrigenId, operacion.monto, operacion.tipoOperacion.esDebito, operacion.tipoOperacion.afectaSaldo, operacion.tipoOperacion.afectaSaldoDisponible)
  
    if(!operacion) return generateApiErrorResponse("Error creando la operacion para anular el cheque", 404)
  
    return generateApiSuccessResponse(
      200,
      `Cheque n° ${cheque.numeroCheque} fue anulado`,
      cheque
    );

  } catch (error) {
    if(error instanceof ApiError) return generateApiErrorResponse(error.message, error.status)
    if(error instanceof Error) return generateApiErrorResponse(error.message, 500)
    else return generateApiErrorResponse("Error al anular cheque", 500)
  }
}

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Cheque } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import reflejarOperacion from "@/lib/operacion/reflejarOperacion";


export async function POST(req: NextRequest) {
  
  const body: Cheque = await req.json();
  const { esRecibido, numeroCheque, monto, fechaEmision, fechaPago, emitidoPor, acreedor, estado, bancoChequeId,tipoOperacionId, cuentaBancariaAfectadaId } = body;

  if(!tipoOperacionId || !numeroCheque || !monto || !esRecibido || !fechaEmision || !fechaPago || !emitidoPor || !acreedor || !estado || !bancoChequeId || !cuentaBancariaAfectadaId) return generateApiErrorResponse("Missing data to create the operation", 400) //Validate credentials

  if(monto.lessThanOrEqualTo(0)) return generateApiErrorResponse("Monto invalido", 400)
  
  try{
    const cheques = await prisma.cheque.create({
      data: {
        tipoOperacionId, numeroCheque, monto, esRecibido, fechaEmision, fechaPago, emitidoPor, acreedor, estado, bancoChequeId, cuentaBancariaAfectadaId
      },
      include: {
        tipoOperacion: true
      }
    })
  
    if(!cheques) return generateApiErrorResponse("Error generando cheque", 400)  

    //Refleja el incremento o decremento en el saldo de la cuenta bancaria siguien las propiedades del tipo de Operacion
    reflejarOperacion(cuentaBancariaAfectadaId, monto, cheques.tipoOperacion.afectaSaldo, cheques.tipoOperacion.esDebito)

    return generateApiSuccessResponse(200, "cheque agregado correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("Un cheque con el mismo identificador ya existe", 400)
    else return generateApiErrorResponse("Algo ha salido mal", 500)
  }  
  
}

export async function GET() {

  const cheque = await prisma.cheque.findMany()

  return generateApiSuccessResponse(200, "Lista de cheques", cheque)

}
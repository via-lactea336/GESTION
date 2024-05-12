import prisma from "@/lib/prisma";
import { Cheque } from "@prisma/client";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const cheques = await prisma.cheque.findMany({
    where: {
      cuentaBancariaAfectadaId: id
    },
    include:{
      bancoCheque: true,
      cuentaAfectada:true, 
    }
  })

  if(!cheques) return generateApiErrorResponse("Cheques no encontradas", 404)

  return generateApiSuccessResponse(200, 'Se obtuvieron las siguientes cheques', cheques)
}
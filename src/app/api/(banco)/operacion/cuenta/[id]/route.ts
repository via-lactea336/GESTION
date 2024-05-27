import prisma from "@/lib/prisma";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const operaciones = await prisma.operacion.findMany({
    where: {
      cuentaBancariaOrigenId: id
    }, include: {
      tipoOperacion: true
    }
  })
  if(!operaciones) return generateApiErrorResponse("Operaciones no encontradas", 404)

  return generateApiSuccessResponse(200, 'Se obtuvieron las siguientes operaciones', operaciones)
}


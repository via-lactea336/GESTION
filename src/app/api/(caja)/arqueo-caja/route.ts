import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {Decimal, PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { ArqueoDeCaja } from "@prisma/client";
import calcularMontoEsperado from "@/lib/moduloCaja/arqueoCaja/calcularMontoEsperado";

export async function POST(req: NextRequest) {
  
  const body: ArqueoDeCaja = await req.json();
  const { aperturaId, montoRegistrado } = body;

  if(!aperturaId || !montoRegistrado ) return generateApiErrorResponse("Faltan datos para el arqueo de caja", 400)

  const montoEsperado = await calcularMontoEsperado(aperturaId)
  
  try{
    const caja = await prisma.arqueoDeCaja.create({
      data: {
        aperturaId,
        montoRegistrado,
        montoEsperado: new Decimal(montoEsperado)
      }
    })
  
    if(!caja) return generateApiErrorResponse("Error generando el arqueo de caja", 400) 
    return generateApiSuccessResponse(200, "El arqueo fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("La caja ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion de la caja", 500)
  }  
}

export async function GET() {
  const cajas = await prisma.caja.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de cajas", cajas)
}
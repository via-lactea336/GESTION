import prisma from "@/lib/prisma";
import { TipoOperacion } from "@prisma/client";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const tipoOperacion = await prisma.tipoOperacion.findFirst({
    where: {
      id
    }
  })

  if(!tipoOperacion) return generateApiErrorResponse("El tipo de operacion no fue encontrado", 404)

  return generateApiSuccessResponse<TipoOperacion>(200, `El tipo de operacion con id: ${id}`, tipoOperacion)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const tipoOperacion = await prisma.tipoOperacion.update({
      where: {
        id
      },
      data:{
        deleted: new Date()
      }
    });
    return generateApiSuccessResponse(200, `El tipo de Operacion con id:${id} fue eliminada`, tipoOperacion);
  } catch (error) {
    return generateApiErrorResponse("Error eliminando el tipo de Operacion", 500);
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:TipoOperacion = await req.json();

  try {
    const tipoOperacion = await prisma.tipoOperacion.update({
      where: {
        id: id
      },
      data: newData
    });

    return generateApiSuccessResponse<TipoOperacion>(200, `Tipo de Operacion con id:${id} actualizada`, tipoOperacion);
  } catch (error) {
    return generateApiErrorResponse("Error actualizando el tipo de operacion", 500);
  }
}
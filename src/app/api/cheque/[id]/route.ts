import prisma from "@/lib/prisma";
import { Cheque } from "@prisma/client";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const cheques = await prisma.cheque.findFirst({
    where: {
      id
    }
  })

  if(!cheques) return generateApiErrorResponse("Cheque no encontrado", 404)

  return generateApiSuccessResponse<Cheque>(200, `Cheque con id: ${id}`, cheques)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const cheque = await prisma.cheque.delete({
      where: {
        id
      }
    });
    return generateApiSuccessResponse(200, `Cheque con id: ${id} fue eliminado`, cheque);
  } catch (error) {
    return generateApiErrorResponse("Error eliminando el cheque", 500);
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Cheque = await req.json();

  try {
    const operacion = await prisma.cheque.update({
      where: {
        id: id
      },
      data: newData
    });

    return generateApiSuccessResponse<Cheque>(200, `Cheque con id: ${id} fue actualizado`, operacion);
  } catch (error) {
    return generateApiErrorResponse("Error actualizando Cheque", 500);
  }
}
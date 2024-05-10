import prisma from "@/lib/prisma";
import { Operacion } from "@prisma/client";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const operacion = await prisma.operacion.findFirst({
    where: {
      id
    },
    include: {
      tipoOperacion: true,
      cuentaBancariaOrigen: {
        include: {
          banco: true,
          entidad: true,
        }
      }
    }
  })

  if(!operacion) return generateApiErrorResponse("Operation not found", 404)
  // console.log('Este es el de la API \n', operacion)
  return generateApiSuccessResponse(200, `Operation ${id}`, operacion)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const operacion = await prisma.operacion.delete({
      where: {
        id
      }
    });
    return generateApiSuccessResponse(200, `Operation ${id} deleted`, operacion);
  } catch (error) {
    return generateApiErrorResponse("Error deleting Operation", 500);
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Operacion = await req.json();

  try {
    const operacion = await prisma.operacion.update({
      where: {
        id: id
      },
      data: newData
    });

    return generateApiSuccessResponse<Operacion>(200, `Operation ${id} updated`, operacion);
  } catch (error) {
    return generateApiErrorResponse("Error updating Operation", 500);
  }
}
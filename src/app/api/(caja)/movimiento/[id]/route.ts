import prisma from "@/lib/prisma";
import { Movimiento } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const movimiento = await prisma.movimiento.findUnique({
    where: {
      id
    }
  })

  if(!movimiento) return generateApiErrorResponse("El movimiento de la caja no existe en la base de datos", 404)
  return generateApiSuccessResponse(200, `El movimiento con ${id}:`, movimiento)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const movimiento = await prisma.movimiento.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `El movimiento con id:${id} fue eliminado correctamente de la base de datos`, movimiento);
    }

    const movimiento = await prisma.movimiento.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!movimiento) return generateApiErrorResponse("No se ha podido eliminar el movimiento", 500)

    return generateApiSuccessResponse(200, `El movimiento con id:${id} fue eliminado correctamente`, movimiento);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error eliminando el movimiento", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Movimiento = await req.json();

  try {
    const movimiento = await prisma.movimiento.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `El movimiento con id:${id} fue actualizado`, movimiento);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error actualizando el movimiento", 500);
  }
}
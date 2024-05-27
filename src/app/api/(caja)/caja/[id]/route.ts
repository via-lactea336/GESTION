import prisma from "@/lib/prisma";
import { Caja } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const caja = await prisma.caja.findUnique({
    where: {
      id
    }
  })

  if(!caja) return generateApiErrorResponse("La caja no existe en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `La caja con ${id}:`, caja)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const caja = await prisma.caja.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `La caja con id:${id} fue eliminado correctamente de la base de datos`, caja);
    }

    const caja = await prisma.caja.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!caja) return generateApiErrorResponse("No se ha podido eliminar la caja", 500)

    return generateApiSuccessResponse(200, `La caja con id:${id} fue eliminado correctamente`, caja);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error eliminando la caja", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Caja = await req.json();

  try {
    const caja = await prisma.caja.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `La caja con id:${id} fue actualizado`, caja);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error actualizando la caja", 500);
  }
}
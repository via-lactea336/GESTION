import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })

  if(!user) return generateApiErrorResponse("El usuario no existe en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `El usuario con ${id}:`, user)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const user = await prisma.user.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `El usuario con id:${id} fue eliminado correctamente de la base de datos`, user);
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!user) return generateApiErrorResponse("No se ha podido eliminar el usuario", 500)

    // Devuelve éxito con el usuario eliminado
    return generateApiSuccessResponse(200, `El usuario con id:${id} fue eliminado correctamente`, user);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error eliminando el usuario", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:User = await req.json();

  try {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `El usuario con id:${id} fue actualizado`, user);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error actualizando el usuario", 500);
  }
}
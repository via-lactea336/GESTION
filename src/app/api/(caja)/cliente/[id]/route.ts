import prisma from "@/lib/prisma";
import { Cliente } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const cliente = await prisma.cliente.findUnique({
    where: {
      id
    }
  })

  if(!cliente) return generateApiErrorResponse("El cliente no existe en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `El cliente con ${id}:`, cliente)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const caja = await prisma.cliente.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `El cliente con id:${id} fue eliminado correctamente de la base de datos`, caja);
    }

    const caja = await prisma.cliente.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!caja) return generateApiErrorResponse("No se ha podido eliminar al cliente", 500)

    return generateApiSuccessResponse(200, `El cliente con id:${id} fue eliminado correctamente`, caja);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error eliminando al cliente", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Cliente = await req.json();

  try {
    const caja = await prisma.caja.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `El cliente con id:${id} fue actualizado`, caja);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error actualizando al cliente", 500);
  }
}
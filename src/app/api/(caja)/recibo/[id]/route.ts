import prisma from "@/lib/prisma";
import { Recibos } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const recibo = await prisma.recibos.findUnique({
    where: {
      id
    }
  })

  if(!recibo) return generateApiErrorResponse("el recibo no existe en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `Exito obteniendo el recibo`, recibo)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const recibo = await prisma.recibos.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `el recibo fue eliminada correctamente de la base de datos`, recibo);
    }

    const recibo = await prisma.recibos.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!recibo) return generateApiErrorResponse("No se ha podido eliminar el recibo", 500)

    return generateApiSuccessResponse(200, `el recibo fue eliminada correctamente`, recibo);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error eliminando el recibo", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Recibos = await req.json();

  try {
    const recibo = await prisma.recibos.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `el recibo fue actualizada`, recibo);
  } catch (error) {
    return generateApiErrorResponse("Error actualizando el recibo", 500);
  }
}
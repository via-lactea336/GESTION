import prisma from "@/lib/prisma";
import { Comprobante } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const comprobante = await prisma.comprobante.findUnique({
    where: {
      id
    }
  })

  if(!comprobante) return generateApiErrorResponse("el comprobante no existe en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `Exito obteniendo el comprobante`, comprobante)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const comprobante = await prisma.comprobante.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `el comprobante fue eliminada correctamente de la base de datos`, comprobante);
    }

    const comprobante = await prisma.comprobante.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!comprobante) return generateApiErrorResponse("No se ha podido eliminar el comprobante", 500)

    return generateApiSuccessResponse(200, `el comprobante fue eliminado correctamente`, comprobante);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error eliminando el comprobante", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Comprobante = await req.json();

  try {
    const comprobante = await prisma.comprobante.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `el comprobante fue actualizado`, comprobante);
  } catch (error) {
    return generateApiErrorResponse("Error actualizando el comprobante", 500);
  }
}
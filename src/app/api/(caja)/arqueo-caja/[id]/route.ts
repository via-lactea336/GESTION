import prisma from "@/lib/prisma";
import { Caja } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const arqueoDeCaja = await prisma.arqueoDeCaja.findUnique({
    where: {
      id
    }
  })

  if(!arqueoDeCaja) return generateApiErrorResponse("El arqueo de caja no existe en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `El arqueo de caja con ${id}:`, arqueoDeCaja)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const arqueoDeCaja = await prisma.arqueoDeCaja.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `El arqueo de caja con id:${id} fue eliminado correctamente de la base de datos`, arqueoDeCaja);
    }

    const arqueoDeCaja = await prisma.arqueoDeCaja.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!arqueoDeCaja) return generateApiErrorResponse("No se ha podido eliminar el arqueo de caja", 500)

    return generateApiSuccessResponse(200, `El arqueo de caja con id:${id} fue eliminado correctamente`, arqueoDeCaja);
  } catch (error) {
    return generateApiErrorResponse("Error eliminando el arqueo de caja", 500);
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

    return generateApiSuccessResponse(200, `El arqueo de caja con id:${id} fue actualizado`, caja);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error actualizando el arqueo de caja", 500);
  }
}
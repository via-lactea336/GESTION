import prisma from "@/lib/prisma";
import { TipoMovimiento } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
    where: {
      id
    }
  })

  if(!tipoMovimiento) return generateApiErrorResponse("El tipo de movimiento de la caja no existe en la base de datos", 404)
  return generateApiSuccessResponse(200, `El tipo de movimiento con ${id}:`, tipoMovimiento)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const tipoMovimiento = await prisma.tipoMovimiento.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `El tipo de movimiento con id:${id} fue eliminado correctamente de la base de datos`, tipoMovimiento);
    }

    const tipoMovimiento = await prisma.tipoMovimiento.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!tipoMovimiento) return generateApiErrorResponse("No se ha podido eliminar el tipo de movimiento", 500)

    return generateApiSuccessResponse(200, `El tipo de movimiento con id:${id} fue eliminado correctamente`, tipoMovimiento);
  } catch (error) {
    return generateApiErrorResponse("Error eliminando el tipo de movimiento", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:TipoMovimiento = await req.json();

  try {
    const tipoMovimiento = await prisma.tipoMovimiento.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `El tipo de movimiento con id:${id} fue actualizado`, tipoMovimiento);
  } catch (error) {
    return generateApiErrorResponse("Error actualizando el tipo de movimiento", 500);
  }
}
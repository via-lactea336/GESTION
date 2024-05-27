import prisma from "@/lib/prisma";
import { MovimientoDetalle } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const movimientoDetalle = await prisma.movimientoDetalle.findUnique({
    where: {
      id
    }
  })

  if(!movimientoDetalle) return generateApiErrorResponse("El movimiento detalle de la caja no existe en la base de datos", 404)
  return generateApiSuccessResponse(200, `El movimiento detalle con ${id}:`, movimientoDetalle)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const movimientoDetalle = await prisma.movimientoDetalle.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `El movimiento con id:${id} fue eliminado correctamente de la base de datos`, movimientoDetalle);
    }

    const movimientoDetalle = await prisma.movimientoDetalle.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!movimientoDetalle) return generateApiErrorResponse("No se ha podido eliminar el movimiento detalle", 500)

    return generateApiSuccessResponse(200, `El movimiento detalle con id:${id} fue eliminado correctamente`, movimientoDetalle);
  } catch (error) {
    return generateApiErrorResponse("Error eliminando el movimiento detalle", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:MovimientoDetalle = await req.json();

  try {
    const movimientoDetalle = await prisma.movimientoDetalle.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `El movimiento detalle con id:${id} fue actualizado`, movimientoDetalle);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error actualizando el movimiento detalle", 500);
  }
}
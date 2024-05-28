import prisma from "@/lib/prisma";
import { MovimientoDetalle } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const producto = await prisma.producto.findUnique({
    where: {
      id
    }
  })

  if(!producto) return generateApiErrorResponse("El producto no existe en la base de datos", 404)
  return generateApiSuccessResponse(200, `El producto fue encontrado exitosamente`, producto)
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
      return generateApiSuccessResponse(200, `El movimiento fue eliminado correctamente de la base de datos`, movimientoDetalle);
    }

    const movimientoDetalle = await prisma.movimientoDetalle.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!movimientoDetalle) return generateApiErrorResponse("No se ha podido eliminar el producto", 500)

    return generateApiSuccessResponse(200, `El producto fue eliminado correctamente`, movimientoDetalle);
  } catch (error) {
    return generateApiErrorResponse("Error eliminando el producto", 500);
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

    return generateApiSuccessResponse(200, `El producto fue actualizado`, movimientoDetalle);
  } catch (error) {
    return generateApiErrorResponse("Error actualizando el producto", 500);
  }
}
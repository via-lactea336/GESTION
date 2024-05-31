import prisma from "@/lib/prisma";
import { AperturaCaja, Caja } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const aperturaCaja = await prisma.aperturaCaja.findUnique({
    where: {
      id
    }
  })

  if(!aperturaCaja) return generateApiErrorResponse("La apertura de caja no existe en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `La apertura de caja con ${id}:`, aperturaCaja)
}


export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const aperturaCaja = await prisma.aperturaCaja.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `La apertura de caja con id:${id} fue eliminado correctamente de la base de datos`, aperturaCaja);
    }

    const aperturaCaja = await prisma.aperturaCaja.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!aperturaCaja) return generateApiErrorResponse("No se ha podido eliminar la apertura de caja", 500)

    return generateApiSuccessResponse(200, `La apertura de caja con id:${id} fue eliminado correctamente`, aperturaCaja);
  } catch (error) {
    return generateApiErrorResponse("Error eliminando la apertura de caja", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:AperturaCaja = await req.json();

  try {
    const aperturaCaja = await prisma.aperturaCaja.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `La apertura de la caja con id:${id} fue actualizado`, aperturaCaja);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error actualizando la apertura de caja", 500);
  }
}
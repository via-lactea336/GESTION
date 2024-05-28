import prisma from "@/lib/prisma";
import { Factura } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const factura = await prisma.factura.findUnique({
    where: {
      id
    }
  })

  if(!factura) return generateApiErrorResponse("La factura detalle no existe en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `Exito obteniendo la factura detalle`, factura)
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
      return generateApiSuccessResponse(200, `La factura detalle fue eliminada correctamente de la base de datos`, caja);
    }

    const caja = await prisma.cliente.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!caja) return generateApiErrorResponse("No se ha podido eliminar la factura detalle", 500)

    return generateApiSuccessResponse(200, `La factura detalle fue eliminada correctamente`, caja);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error eliminando la factura detalle", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Factura = await req.json();

  try {
    const factura = await prisma.factura.update({
      where: {
        id
      },
      data: newData
    });

    return generateApiSuccessResponse(200, `La factura detalle fue actualizada`, factura);
  } catch (error) {
    return generateApiErrorResponse("Error actualizando la factura detalle", 500);
  }
}
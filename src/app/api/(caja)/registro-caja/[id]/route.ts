import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {deleteFromDB}:{deleteFromDB:boolean} = await req.json();
  try {
    
    if(deleteFromDB){
      const registroCaja = await prisma.registroCaja.delete({
        where: {
          id
        }
      })
      return generateApiSuccessResponse(200, `El registro de caja fue eliminada correctamente de la base de datos`, registroCaja);
    }

    const registroCaja = await prisma.registroCaja.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });

    if(!registroCaja) return generateApiErrorResponse("No se ha podido eliminar la factura", 500)

    return generateApiSuccessResponse(200, `La factura fue eliminada correctamente`, registroCaja);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error eliminando la factura", 500);
  }
}
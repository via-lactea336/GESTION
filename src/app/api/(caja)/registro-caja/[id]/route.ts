import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const registroCaja = await prisma.registroCaja.findUnique({
      where: {
        id
      },
      include: {
        apertura:{
          include:{
            arqueo: true,
            movimiento: {
              include:{
                factura: true,
                comprobantes:{
                  include:{
                    user:{
                      select:{
                        nombre: true,
                        apellido: true,
                        docIdentidad: true
                      }
                    }
                  }
                },
                movimientoDetalles: {
                  include:{
                    tarjeta: true,
                    chequeCaja: true
                  }
                }
              }
            }
          }
        }
      }
    });
    if(!registroCaja) return generateApiErrorResponse("No se ha podido encontrar el registro de caja", 500)
    return generateApiSuccessResponse(200, `Registro de caja encontrada exitosamente`, registroCaja);
  } catch (error) {
    // Si hay un error al buscar, devuelve un mensaje de error
    return generateApiErrorResponse("Error buscando el registro de caja caja", 500);
  }
}

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
import prisma from "@/lib/prisma";
import { Entidad } from "@prisma/client";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import { NextRequest } from "next/server";


//GET /api/entidad/[id]
/**
 * It allows to get a bank in the database by its id
 * @param param0 The id of the bank.
 * @returns Returns a NextResponse object.
 */
export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const entidad = await prisma.entidad.findFirst({
    where: {
      id
    }
  })

  if(!entidad) return generateApiErrorResponse("Bank not found", 404)

  //Return success
  return generateApiSuccessResponse<Entidad>(200, `Bank ${id}`, entidad)
}

// DELETE /api/entidad/[id]
/**
 * Permite eliminar una entidad de la base de datos por su id.
 * @param param0 El id de la entidad.
 * @returns Devuelve un objeto NextResponse.
 */
export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const deleteEntity = await prisma.entidad.delete({
      where: {
        id
      }
    });

    // Devuelve éxito con la entidad eliminada
    return generateApiSuccessResponse(200, `entity ${id} deleted`, deleteEntity);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error deleting entity", 500);
  }
}

// PUT /api/entidad/[id]
/**
 * Permite actualizar una Entidad en la base de datos por su id.
 * @param req Los nuevos datos de la entidad.
 * @param param1 El id de la entidad
 * @returns Devuelve un objeto NextResponse.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Entidad = await req.json();

  try {
    const updatedEntity = await prisma.entidad.update({
      where: {
        id
      },
      data: newData
    });

    // Devuelve éxito con el entidad actualizado
    return generateApiSuccessResponse<Entidad>(200, `entity ${id} updated`, updatedEntity);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error updating entity", 500);
  }
}
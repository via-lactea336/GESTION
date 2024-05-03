import prisma from "@/lib/prisma";
import { Banco } from "@prisma/client";
import { NextRequest } from "next/server";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";


//GET /api/banco/[id]
/**
 * It allows to get a bank in the database by its id
 * @param param0 The id of the bank.
 * @returns Returns a NextResponse object.
 */
export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const bank = await prisma.banco.findFirst({
    where: {
      id
    }
  })

  if(!bank) return generateApiErrorResponse("Bank not found", 404)

  //Return success
  return generateApiSuccessResponse<Banco>(200, `Bank ${id}`, bank)
}

// DELETE /api/banco/[id]
/**
 * Permite eliminar un banco de la base de datos por su id.
 * @param param0 El id del banco.
 * @returns Devuelve un objeto NextResponse.
 */
export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const deletedBank = await prisma.banco.delete({
      where: {
        id
      }
    });

    // Devuelve éxito con el banco eliminado
    return generateApiSuccessResponse<Banco>(200, `Bank ${id} deleted`, deletedBank);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error deleting bank", 500);
  }
}

// PUT /api/banco/[id]
/**
 * Permite actualizar un banco en la base de datos por su id.
 * @param req Los nuevos datos del banco.
 * @param param1 El id del banco y l
 * @returns Devuelve un objeto NextResponse.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:Banco = await req.json();

  try {
    const updatedBank = await prisma.banco.update({
      where: {
        id
      },
      data: newData
    });

    // Devuelve éxito con el banco actualizado
    return generateApiSuccessResponse<Banco>(200, `Bank ${id} updated`, updatedBank);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error updating bank", 500);
  }
}
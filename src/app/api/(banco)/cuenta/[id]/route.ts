import prisma from "@/lib/prisma";
import { CuentaBancaria } from "@prisma/client";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";
import { NextRequest } from "next/server";


//GET /api/cuenta/[id]
/**
 * It allows to get a Bank account in the database by its id
 * @param param0 The id of the Bank account .
 * @returns Returns a NextResponse object.
 */
export async function GET(req:NextRequest, { params }: { params: { id: string } }) {

  const id = params.id
  
  const accountBank = await prisma.cuentaBancaria.findFirst({
    where: {
      id
    },
    include: {
      banco: {
        select:{
          id: true,
          nombre: true,
        }
      }
    }
  })

  if(!accountBank) return generateApiErrorResponse("Bank account not found", 404)

  //Return success
  return generateApiSuccessResponse<CuentaBancaria>(200, `Cuenta ${id}`, accountBank)
}

// DELETE /api/cuenta/[id]
/**
 * Permite eliminar una cuenta bancaria de la base de datos por su id.
 * @param param0 El id de la Cuenta Bancaria.
 * @returns Devuelve un objeto NextResponse.
 */
export async function DELETE(req:NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const deletedBankAccount = await prisma.cuentaBancaria.update({
      where: {
        id
      },
      data: {
        deleted: new Date()
      }
    });
    
    // Devuelve éxito con la Cuenta Bancaria eliminada
    return generateApiSuccessResponse(200, `Bank Account ${id} deleted`, deletedBankAccount);
  } catch (error) {
    // Si hay un error al eliminar, devuelve un mensaje de error
    return generateApiErrorResponse("Error deleting the bank account", 500);
  }
}

// PUT /api/cuenta/[id]
/**
 * Permite actualizar una Cuenta Bancaria en la base de datos por su id.
 * @param req Los nuevos datos de la Cuenta Bancaria.
 * @param param1 El id de la Cuenta Bancaria
 * @returns Devuelve un objeto NextResponse.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const newData:CuentaBancaria = await req.json();
  try {
    const updatedEntity = await prisma.cuentaBancaria.update({
      where: {
        id
      },
      data: newData
    });

    // Devuelve éxito con el entidad actualizado
    return generateApiSuccessResponse<CuentaBancaria>(200, `Bank account ${id} updated`, updatedEntity);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error updating bank account", 500);
  }
}
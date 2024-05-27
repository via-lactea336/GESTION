import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Banco } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

// POST /api/banco/
/**
 * It allows to add a bank in the database
 * @param req The request object were should be the data of the bank.
 * @returns Returns a NextResponse object.
 */
export async function POST(req: NextRequest) {
  
  //Get the name of the bank
  const body: Banco = await req.json();
  const { nombre } = body;
  
  if(!nombre) return generateApiErrorResponse("Missing bank's name", 400) //Validate credentials

  //Create new bank
  try{
    const bank = await prisma.banco.create({
      data: {
        nombre,
      }
    })
  
    if(!bank) return generateApiErrorResponse("Error generating bank", 400)  

    //Return success
    return generateApiSuccessResponse(200, "Bank added successfully")
  
  }catch(err){
    //If the bank already exists then return an error
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("Bank already exists", 400)
    else return generateApiErrorResponse("Something went wrong", 500)
  }  
  
}

//GET /api/banco/
/**
 * It allows to get all banks in the database
 * @returns Returns all banks.
 */
export async function GET() {

  //Get all banks
  const banks = await prisma.banco.findMany()

  //Return success
  return generateApiSuccessResponse<Banco[]>(200, "Banks list", banks)

}
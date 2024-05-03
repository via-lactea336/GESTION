import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Entidad } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

// POST /api/banco/
/**
 * It allows to add an entity in the database
 * @param req The request object were should be the data of the entity.
 * @returns Returns a NextResponse object.
 */
export async function POST(req: NextRequest) {
  
  //Get the name of the bank
  const body: Entidad = await req.json();
  const { nombre, ruc } = body;
  
  if(!nombre || !ruc) return generateApiErrorResponse("Missing data to create the entity", 400) //Validate credentials

  //Create new entity
  try{
    const entity = await prisma.entidad.create({
      data: {
        nombre,
        ruc
      }
    })
  
    if(!entity) return generateApiErrorResponse("Error generating entity", 400)  

    //Return success
    return generateApiSuccessResponse(200, "Entity added successfully")
  
  }catch(err){
    //If the bank already exists then return an error
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("Entity already exists", 400)
    else return generateApiErrorResponse("Something went wrong", 500)
  }  
  
}

//GET /api/banco/
/**
 * It allows to get all entities in the database
 * @returns Returns all entities.
 */
export async function GET() {

  //Get all banks
  const entidades = await prisma.entidad.findMany()

  //Return success
  return generateApiSuccessResponse(200, "Entities list", entidades)

}
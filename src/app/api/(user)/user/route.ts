import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { hashPassword } from '@/lib/bcrypt'
import { User, Roles } from "@prisma/client";

// POST /api/auth/signup
/**
 * It allows to create a new user in the database
 * @param req The request object were should be the credentials.
 * @returns Returns a NextResponse object.
 */
export async function POST(req: NextRequest) {
  
  //Get credentials
  const body: User = await req.json();
  const { nombre, apellido, docIdentidad, username, password, rol } = body;
  
  if( !nombre || !apellido || !docIdentidad || !username || !password) return generateApiErrorResponse("No hay informacion suficiente para la creacion del nuevo usuario", 400) //Validate credentials

  if(rol && rol in Roles) return generateApiErrorResponse("El Rol ingresado es invalido", 400)

  const hashedPassword = await hashPassword(password) //Hash the password of the new user 

  //Create new user
  try{
    const newUser = await prisma.user.create({
      data: {
        nombre,
        apellido,
        docIdentidad,
        rol,
        username,
        password: hashedPassword
      }
    })
  
    if(!newUser) return generateApiErrorResponse("Error generando un usuario", 400)  //If the user were not created then return an error

    //Return success
    return generateApiSuccessResponse(200, "El usuario fue creado correctamente")
  
  }catch(err){
    //If the user already exists then return an error
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El usuario ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion del usuario", 500)
  }  
  
}

export async function GET() {

  //Get all users
  const users = await prisma.user.findMany()

  //Return success
  return generateApiSuccessResponse(200, "Exito al obtener la lista de usuarios", users)

}
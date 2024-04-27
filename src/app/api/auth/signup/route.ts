import { NextRequest } from "next/server";
import { SignUpCredentials } from "@/type";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "@/libs/prisma";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/libs/apiResponse";
import { hashPassword } from '@/libs/bcrypt'

// POST /api/auth/signup
/**
 * It allows to create a new user in the database
 * @param req The request object were should be the credentials.
 * @returns Returns a NextResponse object.
 */
export async function POST(req: NextRequest) {
  
  //Get credentials
  const body: SignUpCredentials = await req.json();
  const { username, password } = body;
  
  if(!username || !password) return generateApiErrorResponse("Missing username or password", 400) //Validate credentials

  const hashedPassword = await hashPassword(password) //Hash the password of the new user 

  //Create new user
  try{
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })
  
    if(!newUser) return generateApiErrorResponse("Missing username or password", 400)  //If the user were not created then return an error

    //Return success
    return generateApiSuccessResponse(200, "User created successfully")
  
  }catch(err){
    //If the user already exists then return an error
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("User already exists", 400)
    else return generateApiErrorResponse("Something went wrong", 500)
  }  
  
}
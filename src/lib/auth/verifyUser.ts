import { Roles } from "@prisma/client";
import prisma from "../prisma";
import {comparePasswords} from "@/lib/bcrypt"
import ApiError from "../api/ApiError";

export default async function verifyUser(username: string, password: string, rol?:Roles){
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  if(!user) throw new ApiError("El usuario o la contraseña no coinciden", 401)
  const match = await comparePasswords(password, user.password)
  if(!match) throw new ApiError("El usuario o la contraseña no coinciden", 401)

  if(rol !== undefined && rol && user.rol !== rol) throw new ApiError(`El usuario no es un ${rol}`, 401);

  return user
}
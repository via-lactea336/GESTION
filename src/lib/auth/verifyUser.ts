import { Roles } from "@prisma/client";
import prisma from "../prisma";
import {comparePasswords} from "@/lib/bcrypt"

export default async function verifyUser(username: string, password: string, rol?:Roles){
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  if(!user) throw new Error("El usuario o la contraseña no coinciden")
  const match = await comparePasswords(password, user.password)
  if(!match) throw new Error("El usuario o la contraseña no coinciden")

  if(rol !== undefined && rol && user.rol !== rol) throw new Error(`El usuario no es un ${rol}`);

  return user
}
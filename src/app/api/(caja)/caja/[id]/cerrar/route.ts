import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";
import { comparePasswords } from "@/lib/bcrypt";
import cerrarCaja from "@/lib/moduloCaja/cerrarCaja";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  const id = params.id;
  const {
    username,
    password,
    aperturaId,
    observaciones,
  }: {
    username: string,
    password: string,
    aperturaId:string,
    observaciones?:string
  } = await req.json();

  if(!username || !password) return generateApiErrorResponse("Es necesario un usuario y una contraseña del administrador", 400)
  if(!aperturaId) return generateApiErrorResponse("No se puede cerrar la caja sin el identificador de la apertura activa", 400)

  const user = await prisma.user.findUnique({
    where: {
      username
    },
    select: {
      password: true,
      rol: true
    }
  })

  if(!user || !await comparePasswords(password, user.password)) return generateApiErrorResponse("El usuario o la contraseña son incorrectos", 400)
  if(user.rol !== "ADMIN") return generateApiErrorResponse("Acceso no autorizado, no eres administrador", 401)

  try {
    await cerrarCaja(aperturaId, observaciones);
    return generateApiSuccessResponse(200, `La caja se ha cerrado exitosamente`);
  } catch (error) {
    if(error instanceof Error) return generateApiErrorResponse(error.message, 500)
    return generateApiErrorResponse("Error cerrando la caja", 500);
  }
}
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse";
import authOptions from "@/lib/auth/options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  const session = await getServerSession(authOptions)
  if (session && session.user.rol !== "ADMIN") return generateApiErrorResponse("Acceso no autorizado, no eres administrador", 401)

  const id = params.id;
  const {
    aperturaId,
    observaciones,
  }: {
    aperturaId:string,
    observaciones?:string
  } = await req.json();

  if(!aperturaId) return generateApiErrorResponse("No se puede cerrar la caja sin el identificador de la apertura activa", 400)

  try {
    const caja = await prisma.caja.update({
      where: {
        id
      },
      data: {
        estaCerrado: true,
        aperturas:{
        update: {
            where: {
              id: aperturaId
            },
            data:{
              cierreCaja: new Date(),
              observaciones
            }
          }
        }
      }
    });

    if(!caja) return generateApiErrorResponse("No se ha podido cerrar la caja", 500)
    return generateApiSuccessResponse(200, `La caja se ha cerrado exitosamente`, caja);
  } catch (error) {
    // Si hay un error al actualizar, devuelve un mensaje de error
    return generateApiErrorResponse("Error cerrando la caja", 500);
  }
}
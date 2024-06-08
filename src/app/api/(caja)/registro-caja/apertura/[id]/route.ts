import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/apiResponse"
import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  const id = params.id

  const registroCaja = await prisma.registroCaja.findUnique({
    where: {
      aperturaId: id
    },
    include: {
      apertura: {
        include:{
          arqueo: {
            select: {
              montoEsperado: true,
              montoRegistrado: true,
              observaciones: true
            }
          },
          movimiento: {
            include: {
              movimientoDetalles: true,
            }
          }
        }
      },
    }
  })

  if (!registroCaja) return generateApiErrorResponse("No existe el registro de caja en la base de datos", 404)

  //Return success
  return generateApiSuccessResponse(200, `Exito obteniendo el registro de caja`, registroCaja)
}
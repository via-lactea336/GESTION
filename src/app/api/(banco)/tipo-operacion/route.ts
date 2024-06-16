import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { TipoOperacion } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";


export async function POST(req: NextRequest) {
  
  const body: TipoOperacion = await req.json();
  const { nombre, esDebito, afectaSaldo, afectaSaldoDisponible, escondido } = body;
  
  if( !nombre || esDebito === undefined || afectaSaldo === undefined || afectaSaldoDisponible === undefined) return generateApiErrorResponse("No hay datos necesarios para crear el tipo de operacion", 400) //Validate credentials

  try{
    const tipoOperacion = await prisma.tipoOperacion.create({
      data: {
        nombre, esDebito, afectaSaldo, afectaSaldoDisponible, escondido
      }
    })
  
    if(!tipoOperacion) return generateApiErrorResponse("Error creando el tipo de operacion", 500)  

    return generateApiSuccessResponse(200, "Tipo de Operacion creada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El tipo de operacion ya existe", 400)
    else return generateApiErrorResponse("Algo ha fallado", 500)
  }  
  
}

export async function GET() {

  const tipoOperacion = await prisma.tipoOperacion.findMany({
    where: {
      escondido: false
    }
  })

  return generateApiSuccessResponse(200, "Lista de tipos de operaciones", tipoOperacion)

}
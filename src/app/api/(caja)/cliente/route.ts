import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { Cliente } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body: Cliente = await req.json();
  const { 
    nombre,
    docIdentidad,
   } = body;

  if(!docIdentidad || !nombre ) return generateApiErrorResponse("Faltan datos para la creacion del cliente", 400)

  try{
    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        docIdentidad,
      }
    })
  
    if(!cliente) return generateApiErrorResponse("Error generando al cliente", 400) 

    return generateApiSuccessResponse(200, "El cliente fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El cliente ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion del cliente", 500)
  }  
}

export async function GET() {
  const clientes = await prisma.cliente.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener la lista de clientes", clientes)
}
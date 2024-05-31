import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { Producto } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body: Producto = await req.json();
  const { 
    nombre,
    precio,
    iva,
    codigo
   } = body;

  if(!nombre || !precio || !codigo ) return generateApiErrorResponse("Faltan datos para el producto", 400)
  if(precio.lessThanOrEqualTo(0)) return generateApiErrorResponse("El precio debe ser mayor a 0", 400)
  if(iva && iva <= 0) return generateApiErrorResponse("El iva debe ser mayor a 0", 400)
  
  try{
    const producto = await prisma.producto.create({
      data: {
        nombre:nombre.toUpperCase(), 
        precio,
        iva,
        codigo
      }
    })
  
    if(!producto) return generateApiErrorResponse("Error generando el producto", 400) 

    return generateApiSuccessResponse(200, "El producto fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El producto ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion del producto", 500)
  }  
}

export async function GET() {
  const productos = await prisma.producto.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener los productos", productos)
}
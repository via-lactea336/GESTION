import { ApiResponseData, DatosFiltrados} from "../../definitions"
import { Producto } from "@prisma/client"
export default async function obtenerReciboFiltro(
  {
    codigo,
    nombre,
    precio,
    iva
  }:{
    codigo:string,
    nombre:string,
    precio:number,
    iva:number|null
  }
){
  try{
    const response = await fetch(`/api/producto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo,
        nombre,
        precio,
        iva
      }),
    }) 
    const data:ApiResponseData = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }
}
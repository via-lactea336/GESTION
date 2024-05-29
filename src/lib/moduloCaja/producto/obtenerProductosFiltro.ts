import { ApiResponseData, DatosFiltrados} from "../../definitions"
import { Producto } from "@prisma/client"
export default async function obtenerReciboFiltro(
  {
    upTo,
    codigo,
    nombre
  }:{
    upTo?:number,
    codigo?:string,
    nombre?:string
  }
){
  
  const searchParams = new URLSearchParams()

  if(upTo) searchParams.append("upTo", upTo.toString())
  if(nombre) searchParams.append("nombre", nombre)
  if(codigo) searchParams.append("codigo", codigo)

  const queryString = searchParams.toString();
  try{
    const response = await fetch(`/api/producto/search?${queryString.trim()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }) 

    const data:ApiResponseData<DatosFiltrados<Producto>> = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }

}
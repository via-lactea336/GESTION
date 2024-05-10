import { Operacion } from "@prisma/client"
import { ApiResponseData } from "../definitions"

export default async function obtenerOperacionesFiltros(
  {
    fechaDesde,
    fechaHasta
  }:{
    fechaDesde?:string,
    fechaHasta?:string
  }
){
  
  const searchParams = new URLSearchParams()

  if(fechaDesde) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta) searchParams.append('fechaHasta', fechaHasta)

  const queryString = searchParams.toString();

  try{
    const response = await fetch(`/api/operacion/search?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }) 

    const data:ApiResponseData<Operacion[]> = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }

}
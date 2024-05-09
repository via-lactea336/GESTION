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
  
  let searchParams = "http://localhost:3000/api/operacion/search?"

  if(fechaDesde) searchParams += `fechaDesde=${fechaDesde}`
  if(fechaHasta) searchParams += `&fechaHasta=${fechaHasta}`

  try{
    const response = await fetch(searchParams, {
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
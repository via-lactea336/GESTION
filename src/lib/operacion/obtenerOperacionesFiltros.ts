import { OperacionAndTipoOperacion } from "../definitions"
import { ApiResponseData } from "../definitions"

export default async function obtenerOperacionesFiltros(
  {
    skip,
    upTo,
    fechaDesde,
    fechaHasta,
  }:{
    skip?:number,
    upTo?:number,
    fechaDesde?:string,
    fechaHasta?:string
  }
){
  
  const searchParams = new URLSearchParams()

  if(fechaDesde) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta) searchParams.append('fechaHasta', fechaHasta)
  if(skip) searchParams.append("skip", skip.toString())
  if(upTo) searchParams.append("upTo", upTo.toString())

  const queryString = searchParams.toString();
  try{
    const response = await fetch(`/api/operacion/search?${queryString.trim()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }) 

    const data:ApiResponseData<OperacionAndTipoOperacion[]> = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }

}
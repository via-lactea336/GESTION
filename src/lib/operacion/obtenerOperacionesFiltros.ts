import { DatosFiltrados, OperacionAndTipoOperacion } from "../definitions"
import { ApiResponseData } from "../definitions"

export default async function obtenerOperacionesFiltros(
  {
    skip,
    upTo,
    fechaDesde,
    fechaHasta,
    cuentaId,
  }:{
    skip?:number,
    upTo?:number,
    fechaDesde?:string,
    fechaHasta?:string,
    cuentaId?:string
  }
){
  
  const searchParams = new URLSearchParams()

  if(fechaDesde) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta) searchParams.append('fechaHasta', fechaHasta)
  if(skip) searchParams.append("skip", skip.toString())
  if(upTo) searchParams.append("upTo", upTo.toString())
  if(cuentaId) searchParams.append("cuentaId", cuentaId)

  const queryString = searchParams.toString();
  try{
    const response = await fetch(`/api/operacion/search?${queryString.trim()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }) 

    const data:ApiResponseData<DatosFiltrados<OperacionAndTipoOperacion>> = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }

}
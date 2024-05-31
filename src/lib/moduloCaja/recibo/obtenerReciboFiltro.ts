import { ApiResponseData, DatosFiltrados} from "../../definitions"
import { Recibos } from "@prisma/client"
export default async function obtenerReciboFiltro(
  {
    skip,
    upTo,
    fechaDesde,
    fechaHasta,
    ruc,
  }:{
    skip?:number,
    upTo?:number,
    fechaDesde?:string,
    fechaHasta?:string,
    ruc?:string,
  }
){
  
  const searchParams = new URLSearchParams()

  if(fechaDesde && fechaDesde.length !== 0) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta && fechaHasta.length !== 0) searchParams.append('fechaHasta', fechaHasta)
  if(skip) searchParams.append("skip", skip.toString())
  if(upTo) searchParams.append("upTo", upTo.toString())
  if(ruc) searchParams.append("cuentaId", ruc)

  const queryString = searchParams.toString();
  try{
    const response = await fetch(`/api/recibo/search?${queryString.trim()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }) 

    const data:ApiResponseData<DatosFiltrados<Recibos>> = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }

}
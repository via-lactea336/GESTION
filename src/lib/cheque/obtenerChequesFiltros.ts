import { estadoCheque } from "@prisma/client"
import { ChequeDetails, ApiResponseData, DatosFiltrados} from "../definitions"

export default async function obtenerChequesFiltros(
  {
    skip,
    upTo,
    fechaDesde,
    fechaHasta,
    cuentaId,
    estado,
    montoDesde,
    montoHasta,
  }:{
    skip?:number,
    upTo?:number,
    fechaDesde?:string,
    fechaHasta?:string,
    cuentaId?:string,
    estado?:estadoCheque,
    montoDesde?:number,
    montoHasta?:number
  }
){
  
  const searchParams = new URLSearchParams()

  if(fechaDesde) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta) searchParams.append('fechaHasta', fechaHasta)
  if(skip) searchParams.append("skip", skip.toString())
  if(upTo) searchParams.append("upTo", upTo.toString())
  if(cuentaId) searchParams.append("cuentaId", cuentaId)
  if(estado) searchParams.append("estado", estado)
  if(montoDesde) searchParams.append("montoDesde", montoDesde.toString())
  if(montoHasta) searchParams.append("montoHasta", montoHasta.toString())

  const queryString = searchParams.toString();
  try{
    const response = await fetch(`/api/cheque/search?${queryString.trim()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }) 

    const data:ApiResponseData<DatosFiltrados<ChequeDetails>> = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }

}
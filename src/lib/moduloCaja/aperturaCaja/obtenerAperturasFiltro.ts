import { DatosFiltrados } from "@/lib/definitions";
import { fetchPlus } from "@/lib/verificarApiResponse";
import { AperturaCaja, User } from "@prisma/client";

export type Filtro = {
  cajaId?: string,
  cerrarda?: boolean,
  fechaDesde?: string,
  fechaHasta?: string,
  skip:number,
  upTo:number
}

type Data = AperturaCaja & {cajero: {nombre:string, apellido:string} & {registro: {id:string}}}

export default async function obtenerAperturasFiltro({fechaDesde, fechaHasta, cajaId, skip, upTo, cerrarda}:Filtro) {
  const server_url = process.env.URL;
  const url = server_url || "";

  const searchParams = new URLSearchParams()

  if(fechaDesde) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta) searchParams.append('fechaHasta', fechaHasta)
  if(cajaId) searchParams.append('cajaId', cajaId)
  if(cerrarda) searchParams.append('cerrarda', cerrarda.toString())

  if(skip) searchParams.append('skip', skip.toString())
  if(upTo) searchParams.append('upTo', upTo.toString())
  
  const queryString = searchParams.toString()

  return await fetchPlus<DatosFiltrados<Data>>(`${url}/api/apertura-caja/search?${queryString}`)

}
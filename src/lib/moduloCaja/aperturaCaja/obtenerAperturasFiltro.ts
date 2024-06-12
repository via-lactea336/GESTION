import { DatosFiltrados } from "@/lib/definitions";
import { fetchPlus } from "@/lib/verificarApiResponse";
import { AperturaCaja, User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type Filtro = {
  cajaId?: string,
  cerrada?: boolean,
  fechaDesde?: string,
  fechaHasta?: string,
  skip:number,
  upTo:number
}

export type Data = AperturaCaja & {cajero: {nombre:string, apellido:string}} & {caja: {numero:string}} & {registro: {id:string, montoIngresoTotal:Decimal, montoEgresoTotal:Decimal}}

export default async function obtenerAperturasFiltro({fechaDesde, fechaHasta, cajaId, skip, upTo, cerrada}:Filtro) {
  const server_url = process.env.URL;
  const url = server_url || "";

  const searchParams = new URLSearchParams()

  if(fechaDesde) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta) searchParams.append('fechaHasta', fechaHasta)
  if(cajaId) searchParams.append('cajaId', cajaId)
  if(cerrada) searchParams.append('cerrada', cerrada.toString())

  if(skip) searchParams.append('skip', skip.toString())
  if(upTo) searchParams.append('upTo', upTo.toString())
  
  const queryString = searchParams.toString()

  return await fetchPlus<DatosFiltrados<Data>>(`${url}/api/apertura-caja/search?${queryString}`)

}
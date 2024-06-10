import { Comprobante, Factura, Movimiento, MovimientoDetalle } from "@prisma/client";
import { fetchPlus } from "../../verificarApiResponse"
import { DatosFiltrados } from "@/lib/definitions";

export type ParamsReportes = {
  cajaId?: string,
  fechaDesde?: string,
  fechaHasta?: string,
  incluirDocumentacion?:boolean,
  skip?:number,
  upTo?:number
}

export type MovimientosFiltroData = 
    Movimiento & (
    {comprobantes: Comprobante[]} &
    {movimientoDetalles: MovimientoDetalle[]} &
    {factura: Factura})|null
  


export default async function obtenerMovimientosFiltro({fechaDesde, fechaHasta, cajaId, incluirDocumentacion, skip, upTo}:ParamsReportes) {
  
  const server_url = process.env.URL;
  const url = server_url || "";

  const searchParams = new URLSearchParams()

  if(fechaDesde) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta) searchParams.append('fechaHasta', fechaHasta)
  if(cajaId) searchParams.append('cajaId', cajaId)
  if(incluirDocumentacion!==undefined && incluirDocumentacion) searchParams.append('incluirDocumentacion', "true")

  if(skip) searchParams.append('skip', skip.toString())
  if(upTo) searchParams.append('upTo', upTo.toString())

  const queryString = searchParams.toString()

  return await fetchPlus<DatosFiltrados<MovimientosFiltroData>>(`${url}/api/movimiento/search?${queryString}`)
}
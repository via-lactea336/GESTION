import { Comprobante, Factura, Movimiento, MovimientoDetalle } from "@prisma/client";
import { fetchPlus } from "../verificarApiResponse"

export type ParamsReportes = {
  cajaId: string|null,
  fechaDesde: string|null,
  fechaHasta: string|null,
  skip?:number,
  upTo?:number
}

export type Reportes = {
  values: 
    Movimiento & 
    {comprobantes: Comprobante} &
    {movimientoDetalles: MovimientoDetalle[]} &
    {factura: Factura}
}

export default async function obtenerReportes({fechaDesde, fechaHasta, cajaId, skip, upTo}:ParamsReportes) {
  
  const server_url = process.env.URL;
  const url = server_url || "";

  const searchParams = new URLSearchParams()

  if(!fechaDesde || !fechaHasta || !cajaId) throw new Error('Faltan parametros para poder realizar el reporte')

  searchParams.append('fechaDesde', fechaDesde)
  searchParams.append('fechaHasta', fechaHasta)
  searchParams.append('cajaId', cajaId)
  searchParams.append('incluirDocumentacion', "true")

  if(skip) searchParams.append('skip', skip.toString())
  if(upTo) searchParams.append('upTo', upTo.toString())

  const queryString = searchParams.toString()

  return await fetchPlus<Reportes>(`${url}/api/movimiento/search?${queryString}`)
}
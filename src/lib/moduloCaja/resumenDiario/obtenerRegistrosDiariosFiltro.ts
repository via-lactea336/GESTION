import { AperturaCaja, ArqueoDeCaja, ChequeCaja, Comprobante, Factura, Movimiento, MovimientoDetalle, RegistroCaja, Tarjeta } from "@prisma/client";
import { fetchPlus } from "../../verificarApiResponse"
import { DatosFiltrados } from "@/lib/definitions";

export type ParamsReportes = {
  cajaId?: string,
  fechaDesde?: string,
  fechaHasta?: string,
  documentacion?:boolean,
  skip:number,
  upTo:number
}

export type Reportes = RegistroCaja & {
  apertura: AperturaCaja & {
    arqueo: ArqueoDeCaja;
    movimiento: (Movimiento &
      {
        factura:Factura|null
        comprobantes: Comprobante[];
        movimientoDetalles: MovimientoDetalle[];
      }
    )[];
  };
};  

export default async function obtenerRegistrosDiariosFiltro({fechaDesde, fechaHasta, cajaId, documentacion, skip, upTo}:ParamsReportes) {
  
  const server_url = process.env.URL;
  const url = server_url || "";

  const searchParams = new URLSearchParams()

  if(fechaDesde) searchParams.append('fechaDesde', fechaDesde)
  if(fechaHasta) searchParams.append('fechaHasta', fechaHasta)
  if(cajaId) searchParams.append('cajaId', cajaId)
  if(documentacion !== undefined && documentacion)  searchParams.append('documentacion', "true")

  if(skip) searchParams.append('skip', skip.toString())
  if(upTo) searchParams.append('upTo', upTo.toString())

  const queryString = searchParams.toString()

  return await fetchPlus<DatosFiltrados<Reportes>>(`${url}/api/registro-caja/search?${queryString}`)
}
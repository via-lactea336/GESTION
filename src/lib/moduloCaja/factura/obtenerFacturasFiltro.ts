import { ApiResponseData, DatosFiltrados } from "@/lib/definitions";
import { fetchPlus } from "@/lib/verificarApiResponse";
import { Cliente, Factura } from "@prisma/client";

export type FacturaCliente = Factura&{cliente:Cliente}

export type Filter = {
  fechaDesde?: string;
  fechaHasta?: string;
  ruc?: string;
  pagado?: boolean;
  esContado?: boolean;
  skip?: number;
  upTo?: number;
}

export default async function obtenerFacturasFiltro(
  {fechaDesde, fechaHasta, ruc, pagado, esContado, skip, upTo}:Filter
){

  const searchParams = new URLSearchParams()

  if(skip) searchParams.append("skip", skip.toString())
  if(upTo) searchParams.append("upTo", upTo.toString())
  if(ruc) searchParams.append("ruc", ruc)
  if(pagado != undefined) searchParams.append("pagado", pagado.toString())
  if(esContado != undefined) searchParams.append("esContado", esContado.toString())
  
  if(fechaDesde) searchParams.append("fechaDesde", fechaDesde)
  if(fechaHasta) searchParams.append("fechaHasta", fechaHasta)

  const queryString = searchParams.toString();

  const server_url = process.env.URL;
  const url = server_url || "";

  
  return await fetchPlus<DatosFiltrados<FacturaCliente>>(`${url}/api/factura/search?${queryString}`)
}
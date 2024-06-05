import { ApiResponseData } from "@/lib/definitions";
import { Factura } from "@prisma/client";

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
  try {
    const aperturasCaja = await fetch(`${url}/api/factura/search?${queryString.trim()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponseData<Factura[]> = await aperturasCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al obtener las facturas");
    if (data.data.length === 0)
      throw new Error("No hay facturas con estas caracteristicas");
    if (typeof data.data === "undefined")
      throw new Error("Error al obtener las facturas");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
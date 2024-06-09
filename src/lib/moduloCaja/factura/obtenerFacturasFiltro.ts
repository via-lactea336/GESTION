import { DatosFiltrados } from "@/lib/definitions";
import { fetchPlus } from "@/lib/verificarApiResponse";
import { Factura } from "@prisma/client";

export type Filter = {
  fechaDesde?: string;
  fechaHasta?: string;
  ruc?: string;
  pagado?: boolean;
  esContado?: boolean;
  numeroFactura?: string;
  skip: number;
  upTo: number;
};

export type FacturaAndClient = Factura & {cliente: {docIdentidad: string, nombre: string}};

export default async function obtenerFacturasFiltro({
  fechaDesde,
  fechaHasta,
  numeroFactura,
  ruc,
  pagado,
  esContado,
  skip,
  upTo,
}: Filter) {
  const searchParams = new URLSearchParams();

  if (skip) searchParams.append("skip", skip.toString());
  if (upTo) searchParams.append("upTo", upTo.toString());
  if (ruc) searchParams.append("ruc", ruc);
  if (pagado != undefined) searchParams.append("pagado", pagado.toString());
  if (esContado != undefined)
    searchParams.append("esContado", esContado.toString());

  if (numeroFactura) searchParams.append("numeroFactura", numeroFactura);
  if (fechaDesde) searchParams.append("fechaDesde", fechaDesde);
  if (fechaHasta) searchParams.append("fechaHasta", fechaHasta);

  const queryString = searchParams.toString();

  const server_url = process.env.URL;
  const url = server_url || "";
  return await fetchPlus<DatosFiltrados<FacturaAndClient>>(
      `${url}/api/factura/search?${queryString.trim()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
  )
  
}

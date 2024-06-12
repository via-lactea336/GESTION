import {
  Comprobante,
  Factura,
  Movimiento,
  MovimientoDetalle,
  Recibos,
} from "@prisma/client";
import { fetchPlus } from "../../verificarApiResponse";
import { DatosFiltrados } from "@/lib/definitions";

export type ParamsReportes = {
  cajaId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  incluirDocumentacion?: boolean;
  identificadorDocumento?: string;
  skip?: number;
  upTo?: number;
};

export type MovimientosFiltroData = Movimiento & {recibo : Recibos} & {
    comprobante: Comprobante &
    { user: { nombre: string; apellido: string; docIdentidad: string } };
} & { movimientoDetalles: MovimientoDetalle[] } & { factura: Factura &{cliente: {nombre: string; docIdentidad: string} }};

export default async function obtenerMovimientosFiltro({
  fechaDesde,
  fechaHasta,
  cajaId,
  incluirDocumentacion,
  identificadorDocumento,
  skip,
  upTo,
}: ParamsReportes) {
  const server_url = process.env.URL;
  const url = server_url || "";

  const searchParams = new URLSearchParams();

  if (fechaDesde) searchParams.append("fechaDesde", fechaDesde);
  if (fechaHasta) searchParams.append("fechaHasta", fechaHasta);
  if (cajaId) searchParams.append("cajaId", cajaId);
  if (identificadorDocumento) searchParams.append("identificadorDocumento", identificadorDocumento);
  if (incluirDocumentacion !== undefined && incluirDocumentacion)
    searchParams.append("incluirDocumentacion", "true");

  if (skip) searchParams.append("skip", skip.toString());
  if (upTo) searchParams.append("upTo", upTo.toString());

  const queryString = searchParams.toString();

  return await fetchPlus<DatosFiltrados<MovimientosFiltroData>>(
    `${url}/api/movimiento/search?${queryString}`
  );
}

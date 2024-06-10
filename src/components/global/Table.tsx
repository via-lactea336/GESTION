import obtenerComprobantePorId from "@/lib/moduloCaja/comprobante/obtenerComprobantePorId";
import obtenerComprobantes from "@/lib/moduloCaja/comprobante/obtenerComprobantes";
import obtenerMovimientosFiltro, {
  MovimientosFiltroData,
  ParamsReportes,
} from "@/lib/moduloCaja/movimiento/obtenerMovimientosFiltro";
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Comprobante } from "@prisma/client";
import { useEffect, useState } from "react";

interface Props extends ParamsReportes {
  esIngreso: boolean;
}

export default function Table({
  cajaId,
  fechaDesde,
  fechaHasta,
  skip,
  upTo,
  esIngreso,
  incluirDocumentacion,
}: Props) {
  const [movimientos, setMovimientos] = useState<MovimientosFiltroData[]>();
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? "0" + day : day}-${
      month < 10 ? "0" + month : month
    }-${year}`;
    return formattedDate;
  };
  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
    return formattedTime;
  };

  useEffect(() => {
    obtenerMovimientosFiltro({
      cajaId,
      fechaDesde,
      fechaHasta,
      skip,
      upTo,
      incluirDocumentacion,
    }).then((res) => {
      setMovimientos(res.data?.values);
    });
  }, [cajaId, fechaDesde, fechaHasta, skip, upTo, incluirDocumentacion]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <table className="hidden min-w-full bg-gray-900 rounded-md text-white md:table">
          <thead className="rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                Tipo de Operación
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Fecha y Hora
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Monto
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Concepto
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Ver Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 text-white">
            {movimientos?.map((mov) => (
              <tr
                key={mov.id}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-t-none  [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap py-3 pl-6">
                  <div className="flex items-center gap-3">
                    {mov.esIngreso ? (
                      <ArrowDownLeftIcon className="text-green-500 w-6 h-6" />
                    ) : (
                      <ArrowUpRightIcon className="text-red-500 w-6 h-6" />
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {formatDate(mov.createdAt)} {formatTime(mov.createdAt)}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {Number(mov.monto).toLocaleString("es-PY")}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {mov.esIngreso
                    ? `Pago de Factura N° ${mov.factura?.numeroFactura}`
                    : mov?.comprobantes[0]?.concepto}
                </td>
                <td className="whitespace-nowrap py-3 pl-6">
                  <div className="flex justify-center gap-3">
                    <EyeIcon className="w-5 h-5 text-white hover:cursor-pointer hover:text-primary-300" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

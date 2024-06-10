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
import { Modal } from "./Modal";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientosFiltroData>();
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
    <div className="mt-6 flow-root relative">
      <div
        className={
          showModal
            ? "blur-sm brightness-50"
            : "inline-block min-w-full align-middle "
        }
      >
        <table className="hidden min-w-full bg-gray-900 rounded-md text-white md:table">
          <thead className="rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                Operación
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
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 text-white text-left">
            {movimientos?.map((mov) => (
              <tr
                key={mov.id}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-t-none  [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap py-3 pl-6">
                  <div className="flex items-center gap-3">
                    {mov.esIngreso ? (
                      <>
                        <ArrowDownLeftIcon className="text-green-500 w-6 h-6" />
                        <span>Cobro de Factura</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRightIcon className="text-red-500 w-6 h-6" />
                        <span>Extracción de Dinero</span>
                      </>
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
                    ? mov?.factura?.concepto
                    : mov?.comprobantes[0]?.concepto}
                </td>
                <td className="whitespace-nowrap py-3 pl-6">
                  <div className="flex justify-center gap-3">
                    <EyeIcon
                      onClick={() => {
                        setShowModal(true);
                        setSelectedMovimiento(mov);
                      }}
                      className="w-5 h-5 text-white hover:cursor-pointer hover:text-primary-300"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedMovimiento && (
        <div className="absolute top-0 w-full">
          <Modal
            setShowModal={setShowModal}
            className="flex-col items-center justify-center"
          >
            <div className="flex flex-col justify-center items-center gap-4">
              <span className="font-semibold text-lg">
                {selectedMovimiento.esIngreso
                  ? `Cobro de Factura N° ${selectedMovimiento.factura.numeroFactura}`
                  : `Extracción de Dinero por ${selectedMovimiento.comprobantes[0].user.nombre} ${selectedMovimiento.comprobantes[0].user.apellido}`}
              </span>
              <div className="flex flex-col justify-between items-center gap-4">
                {selectedMovimiento.esIngreso && (
                  <span className="text-center">
                    Tipo de Venta:{" "}
                    {selectedMovimiento.factura.esContado
                      ? "Contado"
                      : "Crédito"}
                  </span>
                )}
                <span className="text-center">
                  {selectedMovimiento.esIngreso
                    ? "Monto Total de la Factura: " +
                      Number(selectedMovimiento.factura.total).toLocaleString(
                        "es-PY"
                      ) +
                      " Gs."
                    : "N° de Comprobante: " +
                      selectedMovimiento.comprobantes[0].id}
                </span>
                <span className="text-center">
                  Monto de la Operación:{" "}
                  {Number(selectedMovimiento.monto).toLocaleString("es-PY")} Gs.
                </span>
              </div>
              <div className="flex justify-center items-center gap-4">
                <span>Fecha: {formatDate(selectedMovimiento.createdAt)}</span>
                <span>Hora: {formatTime(selectedMovimiento.createdAt)}</span>
              </div>
              <span className="text-center">
                Concepto:{" "}
                {selectedMovimiento.esIngreso
                  ? selectedMovimiento?.factura?.concepto
                  : selectedMovimiento?.comprobantes[0]?.concepto}
              </span>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

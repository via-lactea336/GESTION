import obtenerMovimientosFiltro, {
  MovimientosFiltroData,
  ParamsReportes,
} from "@/lib/moduloCaja/movimiento/obtenerMovimientosFiltro";
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Suspense, useEffect, useState } from "react";
import { Modal } from "./Modal";
import Pagination from "./Pagination";
import TableSkeleton from "./skeleton/TableSkeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props extends ParamsReportes {
  currentPage: number;
  setFilter: (filter: ParamsReportes) => void;
  query: string;
}

export default function Table({
  cajaId,
  fechaDesde,
  fechaHasta,
  skip,
  upTo,
  incluirDocumentacion,
  identificadorDocumento,
  query,
  setFilter,
}: Props) {
  const [movimientos, setMovimientos] = useState<MovimientosFiltroData[]>();
  const [showModal, setShowModal] = useState(false);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [indiceActual, setIndiceActual] = useState(0);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { replace } = useRouter();
  console.log("pathname", pathname);
  const searchParams = useSearchParams();

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
  const createPageURL = (page: string | number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  const changeIndicePagina = (indice: number) => {
    createPageURL(indice + 1);
    setIndiceActual(indice);
    if (upTo) {
      setFilter({
        cajaId,
        fechaDesde,
        fechaHasta,
        skip: indice * upTo,
        upTo,
        incluirDocumentacion,
        identificadorDocumento,
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    obtenerMovimientosFiltro({
      cajaId,
      fechaDesde,
      fechaHasta,
      skip,
      upTo,
      incluirDocumentacion,
      identificadorDocumento: query,
    }).then((res) => {
      setMovimientos(res.data?.values);
      if (res.data?.totalQuantity && upTo) {
        setTotalPaginas(Math.ceil(res.data.totalQuantity / upTo));
      }
      setLoading(false);
    });
  }, [
    cajaId,
    fechaDesde,
    fechaHasta,
    skip,
    upTo,
    incluirDocumentacion,
    identificadorDocumento,
    query,
  ]);

  return (
    <div className="mt-6 flow-root relative">
      <div
        className={
          showModal
            ? "blur-sm brightness-50"
            : "inline-block min-w-full align-middle "
        }
      >
        {loading ? (
          <TableSkeleton />
        ) : (
          <table className="hidden min-w-full bg-gray-900 rounded-md text-white md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Operación
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Hora
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
                          <span>
                            Cobro de Factura{" "}
                            {mov.factura.esContado ? "al Contado" : "a Crédito"}
                          </span>
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
                    {formatTime(mov.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {Number(mov.monto).toLocaleString("es-PY")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {mov.esIngreso
                      ? mov?.factura?.esContado
                        ? `Factura N° ${mov.factura.numeroFactura} pagada por Pedro Meza`
                        : `Factura N° ${mov.factura.numeroFactura} pagada por Pedro Meza`
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
        )}
      </div>
      {showModal && selectedMovimiento && (
        <div className="absolute top-0 w-full">
          <Modal
            setShowModal={setShowModal}
            className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto"
          >
            <div className="flex flex-col justify-center items-center gap-4">
              <span className="font-semibold text-xl text-white">
                {selectedMovimiento.esIngreso
                  ? `Cobro de Factura N° ${selectedMovimiento.factura.numeroFactura}`
                  : `Extracción de Dinero por ${selectedMovimiento.comprobantes[0].user.nombre} ${selectedMovimiento.comprobantes[0].user.apellido}`}
              </span>
              <div className="flex flex-col justify-between items-center gap-2">
                {selectedMovimiento.esIngreso && (
                  <span className="text-center text-gray-100">
                    Tipo de Venta:{" "}
                    {selectedMovimiento.factura.esContado
                      ? "Contado"
                      : "Crédito"}
                  </span>
                )}
                <span className="text-center text-gray-100">
                  Cliente: {selectedMovimiento.factura.clienteId}
                </span>
                <span className="text-center text-gray-100">
                  {selectedMovimiento.esIngreso
                    ? `Monto Total de la Factura: ${Number(
                        selectedMovimiento.factura.total
                      ).toLocaleString("es-PY")} Gs.`
                    : `N° de Comprobante: ${selectedMovimiento.comprobantes[0].id}`}
                </span>
                <span className="text-center text-gray-100">
                  Monto de la Operación:{" "}
                  {Number(selectedMovimiento.monto).toLocaleString("es-PY")} Gs.
                </span>
              </div>
              <div className="flex justify-center items-center gap-4">
                <span className="text-gray-100">
                  Fecha: {formatDate(selectedMovimiento.createdAt)}
                </span>
                <span className="text-gray-100">
                  Hora: {formatTime(selectedMovimiento.createdAt)}
                </span>
              </div>
              <span className="text-center text-gray-100">
                Concepto:{" "}
                {selectedMovimiento.esIngreso
                  ? selectedMovimiento?.factura?.concepto
                  : selectedMovimiento?.comprobantes[0]?.concepto}
              </span>
              <div className="flex flex-col justify-center items-center gap-4">
                <span className="text-center text-gray-100">Detalles:</span>
                <div className="flex flex-col justify-between items-center gap-2">
                  {selectedMovimiento.movimientoDetalles.map((detalle) => (
                    <div
                      key={detalle.id}
                      className="flex justify-between items-center gap-4 bg-gray-100 p-2 rounded-md w-full"
                    >
                      <span className="font-medium text-gray-800">
                        {Number(detalle.monto).toLocaleString("es-PY")} Gs.
                      </span>
                      <span className="text-gray-600">
                        Pagado con {detalle.metodoPago.toLocaleLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
      <Pagination
        indiceActual={indiceActual}
        indicesPagina={totalPaginas}
        changeIndicePagina={changeIndicePagina}
      />
    </div>
  );
}

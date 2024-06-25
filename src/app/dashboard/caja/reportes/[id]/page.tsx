"use client";
import Header from "@/components/global/Header";
import ResumenDeCaja from "@/components/dashboard/resumendiario/ResumenDeCaja";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumenCajaPDF from "@/components/PDF/ResumenDiario";
import DetalleMovimiento, {
  movimientoDetallado,
} from "@/components/cajaVentanasEmergentes/ResumenDetalle";
import { RegistroDiarioFullData } from "@/lib/definitions";
import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import obtenerRegistroDeCajaPorAperturaId from "@/lib/moduloCaja/resumenDiario/obtenerRegistroDeCajaPorAperturaId";
import { useParams } from "next/navigation";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { Modal } from "@/components/global/Modal";

export default function Page() {
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [registros, setRegistros] = useState<RegistroDiarioFullData>();
  const [detalle, setDetalle] = useState<movimientoDetallado>();

  const [items, setItems] = useState<movimientoDetallado[]>([]);

  const toggleItem = (item: movimientoDetallado) => {
    if (items.includes(item)) {
      setItems(items.filter((i) => i !== item));
      console.log("eliminando");
    } else {
      setItems([...items, item]);
      console.log("agregando");
    }
  };

  useEffect(() => {
    const fetchRegistro = async () => {
      try {
        const registros = await obtenerRegistroDeCajaPorAperturaId(
          id as string
        );
        if (!registros || typeof registros == "string") return;
        console.log(registros);
        setRegistros(registros.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRegistro();
  }, [id]);

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

  return !registros ? (
    <div className="flex justify-center items-center">
      <LoadingCirleIcon className="animate-spin h-8 w-8" />
    </div>
  ) : (
    <div>
      <div className={showModal ? "blur-sm brightness-50" : ""}>
        <Header title="Resumen diario" className="-mt-8">
          <h3 className="ml-8">{registros.apertura.cajero.nombre + " " + registros.apertura.cajero.apellido}</h3>
          <h3>Caja N° {registros.apertura.caja.numero}</h3>
        </Header>

        <div className="bg-gray-800 py-4 px-4 rounded-md mt-5">
          <div className="w-full">
            <ResumenDeCaja {...registros} />
          </div>
        </div>
        <div className="flex my-5 justify-between items-center">
          <h2 className=" font-semibold text-lg">Movimientos</h2>
          <PDFDownloadLink
            className="bg-gray-800 py-1 px-2 rounded-md hover:text-primary-100 hover:bg-gray-900 mx-2"
            document={
              <ResumenCajaPDF
                createdAt={registros.createdAt}
                caja={Number(registros.apertura.caja.numero)}
                cajero={registros.apertura.cajero.nombre + " " + registros.apertura.cajero.apellido}
                apertura={{
                  saldoInicial: Number(registros.montoInicial),
                  createdAt: registros.createdAt,
                }}
                montoRegistrado={Number(registros.montoRegistrado)}
                montoIngreso={Number(registros.montoIngresoEfectivo)}
                montoIngresoCheque={Number(registros.montoIngresoCheque)}
                montoIngresoTarjeta={Number(registros.montoIngresoTarjeta)}
                movimientos={items}
                observaciones={
                  registros.apertura.observaciones
                    ? registros.apertura.observaciones
                    : "Sin observaciones durante el cierre"
                }
              />
            }
            fileName="ResumenCaja.pdf"
          >
            Descargar
          </PDFDownloadLink>
        </div>
        <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5">
          <table className="border-collapse table-auto mx-auto text-center w-full">
            <thead>
              <tr className="bg-gray-900 ">
                <th className="p-2 w-1/5 text-primary-300 font-normal">
                  Imprimir
                </th>
                <th className="p-2 w-1/5 text-primary-300 font-normal">
                  Operacion
                </th>
                <th className="p-2 w-1/5 text-primary-300 font-normal">
                  Monto
                </th>
                <th className="p-2 w-1/5 text-primary-300 font-normal">
                  Fecha
                </th>
                <th className="p-2 w-1/5 text-primary-300 font-normal">Hora</th>
                <th className="p-2 w-1/5 text-primary-300 font-normal">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody>
              {registros.apertura.movimiento?.map((mov, i) => (
                <tr key={mov.id} className="border-b-2 border-gray-700">
                  <td>
                    <button onClick={() => toggleItem(mov)}>
                      {items.includes(mov) ? "Quitar" : "Agregar"}
                    </button>
                  </td>
                  <td
                    className={
                      mov.esIngreso ? "p-2 text-green-400" : "p-2 text-red-400"
                    }
                  >
                    {mov.esIngreso ? "Ingreso" : "Egreso"}
                  </td>
                  <td className="p-2">
                    {Number(mov.monto).toLocaleString("es-PY")} Gs.
                  </td>
                  <td className="p-2">{formatDate(mov.createdAt)}</td>
                  <td className="p-2">{formatTime(mov.createdAt)}</td>
                  <td>
                    <button
                      className="mt-4 mb-4"
                      onClick={() => {
                        setDetalle(mov), setShowModal(true);
                      }}
                    >
                      {
                        <ArrowTopRightOnSquareIcon className="w-6 h-6 ml-auto mr-auto" />
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="flex items-center justify-center">
          <div className="absolute top-20">
            <Modal className="w-full" setShowModal={setShowModal}>
              {detalle ? <DetalleMovimiento {...detalle} /> : ""}
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}

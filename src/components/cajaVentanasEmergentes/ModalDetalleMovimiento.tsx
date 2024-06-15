import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { pdf } from "@react-pdf/renderer";
import saveAs from "file-saver";
import { generatePDF } from "../PDF/ComprobanteEgreso";
import TransferReceipt from "../PDF/ReciboPagoFactura";
import { Modal } from "../global/Modal";
import { MovimientosFiltroData } from "@/lib/moduloCaja/movimiento/obtenerMovimientosFiltro";
import { Cajero, CajaData } from "@/lib/definitions";
import { formatDate, formatTime } from "@/lib/utils";

type Props = {
  selectedMovimiento: MovimientosFiltroData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cajero: Cajero | undefined;
  caja: CajaData | undefined;
};

export default function ModalDetalleMovimiento({
  selectedMovimiento,
  setShowModal,
  setLoading,
  caja,
  cajero,
}: Props) {
  return (
    <div className="absolute top-1/4 w-full">
      <Modal
        setShowModal={setShowModal}
        className="flex flex-col justify-center bg-gray-950 border-white border rounded-lg shadow-lg max-w-lg mx-auto"
        padding="p-8"
      >
        <div className="flex flex-col w-full justify-center items-between gap-2">
          <h3 className="text-lg font-semibold text-gray-50 text-left">
            {selectedMovimiento.esIngreso
              ? `Cobro de Factura N° ${selectedMovimiento.factura.numeroFactura}`
              : `Extracción de Dinero `}
          </h3>
          <div className="flex flex-col w-full justify-between items-start gap-2">
            <span className="text-md font-medium text-gray-400 text-left border-b border-gray-700 w-full">
              {selectedMovimiento.esIngreso
                ? `Al Cliente ${selectedMovimiento.factura.cliente.nombre} con RUC : ${selectedMovimiento.factura.cliente.docIdentidad}`
                : `Por ${selectedMovimiento.comprobante.user.nombre} ${selectedMovimiento.comprobante.user.apellido}`}
            </span>
            {selectedMovimiento.esIngreso && (
              <div className="flex justify-between w-full text-gray-100">
                <span className="text-gray-400 font-medium">
                  Tipo de Venta:
                </span>
                <span className="text-gray-100">
                  {selectedMovimiento.factura.esContado ? "Contado" : "Crédito"}
                </span>
              </div>
            )}
            {selectedMovimiento.esIngreso &&
              !selectedMovimiento.factura.esContado && (
                <div className="flex justify-between w-full text-gray-100">
                  <span className="font-medium text-gray-400">
                    N° de recibo:
                  </span>
                  <span>{selectedMovimiento.recibo.numeroRecibo}</span>
                </div>
              )}
            {selectedMovimiento.esIngreso ? (
              <div className="flex justify-between w-full text-gray-100">
                <span className="font-medium text-gray-400">
                  Monto Total de la Factura:
                </span>
                <span>
                  {Number(selectedMovimiento.factura.total).toLocaleString(
                    "es-PY"
                  )}{" "}
                  Gs.
                </span>
              </div>
            ) : (
              <div className="flex justify-between w-full text-gray-100">
                <span className="font-medium text-gray-400">
                  N° de Comprobante:
                </span>
                <span>{selectedMovimiento.comprobante.numeroComprobante}</span>
              </div>
            )}
            <div className="flex justify-between w-full text-gray-100">
              <span className="font-medium text-gray-400">
                Monto de la Operación:
              </span>
              <span>
                {Number(selectedMovimiento.monto).toLocaleString("es-PY")} Gs.
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between w-full gap-2">
            <div className="flex justify-between w-full text-gray-100">
              <span className="font-medium text-gray-400">Fecha:</span>
              <span>{formatDate(selectedMovimiento.createdAt)}</span>
            </div>
            <div className="flex justify-between w-full text-gray-100">
              <span className="font-medium text-gray-400">Hora:</span>
              <span>{formatTime(selectedMovimiento.createdAt)}</span>
            </div>
          </div>
          {!selectedMovimiento.esIngreso && (
            <div className="flex justify-between w-full text-gray-100">
              <span className="font-medium text-gray-400">Concepto:</span>
              <span>{selectedMovimiento?.comprobante.concepto}</span>
            </div>
          )}
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex flex-col w-full justify-between items-center gap-2">
              {selectedMovimiento.esIngreso &&
                selectedMovimiento.movimientoDetalles.map((detalle) => (
                  <div
                    key={detalle.id}
                    className="flex justify-between w-full items-center text-gray-100"
                  >
                    <span className="font-medium text-gray-400">
                      Pago con {detalle.metodoPago.toLocaleLowerCase()}
                    </span>
                    <span className="text-gray-100">
                      {Number(detalle.monto).toLocaleString("es-PY")} Gs.
                    </span>
                  </div>
                ))}
            </div>
            {selectedMovimiento.esIngreso &&
              !selectedMovimiento.factura.esContado && (
                <button
                  onClick={() => {
                    const recibo = selectedMovimiento.recibo;
                    if (!recibo) return;
                    const generatePDF = async () => {
                      if (recibo) {
                        const doc = (
                          <TransferReceipt
                            numeroRecibo={`${recibo.numeroRecibo}`}
                            nombreCajero={`${selectedMovimiento.apertura.cajero.nombre} ${selectedMovimiento.apertura.cajero.apellido}`}
                            cajaNumero={selectedMovimiento.apertura.caja.numero}
                            fechaEmision={recibo.fechaEmision}
                            cliente={selectedMovimiento.factura.cliente}
                            numeroFactura={
                              selectedMovimiento.factura.numeroFactura
                            }
                            totalPagado={recibo.totalPagado}
                            createdAt={recibo.createdAt}
                          />
                        );

                        const asPdf = pdf();
                        asPdf.updateContainer(doc);
                        const blob = await asPdf.toBlob();
                        saveAs(blob, "recibo.pdf");
                        setLoading(false);
                      }
                    };

                    generatePDF();
                  }}
                  className=" bg-[#6f42c1] flex text-base font-medium w-full gap-1 justify-center items-center p-2 rounded-md hover:bg-[#8753e7]"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 text-white " />
                  Recibo
                </button>
              )}
            {!selectedMovimiento.esIngreso && (
              <button
                onClick={() => {
                  const time = selectedMovimiento.comprobante.fechaEmision;
                  generatePDF({
                    cajero: `${selectedMovimiento.apertura.cajero.nombre} ${selectedMovimiento.apertura.cajero.apellido}`,
                    caja: selectedMovimiento.apertura.caja.numero,
                    dateTime: `${formatDate(time)} ${formatTime(time)}`,
                    monto: Number(selectedMovimiento.monto),
                    observaciones: selectedMovimiento.comprobante.concepto,
                  });
                }}
                className=" bg-[#6f42c1] flex text-base font-medium w-full gap-1 justify-center items-center p-2 rounded-md hover:bg-[#8753e7]"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Comprobante
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

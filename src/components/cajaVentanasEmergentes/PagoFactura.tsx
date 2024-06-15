/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, use } from "react";
import obtenerFacturaPorId from "@/lib/moduloCaja/factura/obtenerFacturaPorId";
import { obtenerCookie } from "@/lib/obtenerCookie";
import {
  AperturaCaja,
  Cliente,
  Factura,
  Recibos,
  medioDePago,
} from "@prisma/client";
import { TrashIcon } from "@heroicons/react/24/outline";
import ModalTarjeta from "./ModalTarjeta";
import obtenerCliente from "@/lib/moduloCaja/cliente/obtenerCliente";
import crearMovimiento from "@/lib/moduloCaja/movimiento/crearMovimiento";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import Input from "../global/Input";
import { pdf } from "@react-pdf/renderer";
import TransferReceipt from "../PDF/ReciboPagoFactura";
import { saveAs } from "file-saver";
import { formatDate } from "@/lib/utils";

type Tarjeta = {
  tipo: string;
  nombreTitular: string;
  banco: string;
};

type Pagos = {
  metodoPago: medioDePago;
  importe: number;
  detalle: string;
  tarjeta?: Tarjeta;
};

interface FacturaConCliente extends Factura {
  cliente: Cliente;
}

export default function PagoFacturas({ idFactura }: { idFactura: string }) {
  const apertura: AperturaCaja = obtenerCookie("apertura");
  const router = useRouter();

  const [factura, setFactura] = useState<FacturaConCliente | null>(null);
  const [metodo, setMetodo] = useState<medioDePago>(medioDePago.EFECTIVO);
  const [detalle, setDetalle] = useState<string>("");
  const [importe, setImporte] = useState<number>(0);
  const [metodosPago, setMetodosPago] = useState<medioDePago[]>([]);
  const [pagos, setPagos] = useState<Pagos[]>([]);
  const [totalPagado, setTotalPagado] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tarjetaTipo, setTarjetaTipo] = useState<string>("Crédito");
  const [nombreTitular, setNombreTitular] = useState<string>("");
  const [banco, setBanco] = useState<string>("Banco Itaú");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [recibo, setRecibo] = useState<Recibos | null>(null);

  const fetchData = async () => {
    try {
      const response = await obtenerFacturaPorId(idFactura as string);

      if (response === undefined || typeof response === "string") {
        setFactura(null);
        return;
      }

      const { success, data, error } = response;

      if (success && data) {
        const responseCliente = await obtenerCliente(data.clienteId);
        if (
          typeof responseCliente === "string" ||
          responseCliente === undefined
        ) {
          throw new Error("Error al obtener el cliente");
        }

        const cliente = responseCliente.data;
        const facturaConRuc = { ...data, cliente };
        setFactura(facturaConRuc);
        setImporte(+facturaConRuc.total - +facturaConRuc.totalSaldoPagado);
      } else {
        setFactura(null);
        setError(error || null);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (idFactura) {
      fetchData();
    }
  }, [idFactura]);

  useEffect(() => {
    if (factura) {
      if (
        Number(factura.total) -
          (importe + totalPagado + Number(factura.totalSaldoPagado)) <
        0
      ) {
        setError("No se puede exceder el monto total de la factura");
      }
      if (
        Number(factura.total) -
          (totalPagado + Number(factura.totalSaldoPagado)) <=
        0
      ) {
        setDisabled(true);
      }
      if (
        importe + totalPagado + Number(factura.totalSaldoPagado) <=
        Number(factura.total)
      ) {
        setError(null);
      }
    }
  }, [importe, totalPagado, factura]);

  const agregarMetodoPago = () => {
    if (importe <= 0) {
      setError("El importe debe ser mayor a 0");
      return;
    }
    if (factura && Number(factura.total) - (importe + totalPagado) < 0) {
      return;
    }

    if (metodo === medioDePago.TARJETA) {
      setModalOpen(true);
    } else {
      // si el metodo de pago es efectivo y ya se ha pagado con efectivo
      // se incrementa el importe en el pago ya existente
      if (metodo === medioDePago.EFECTIVO) {
        const pago = pagos.find((pago) => pago.metodoPago === metodo);
        if (pago) {
          const index = pagos.indexOf(pago);
          const nuevosPagos = [...pagos];
          nuevosPagos[index] = {
            ...pago,
            importe: pago.importe + importe,
          };
          setPagos(nuevosPagos);
          setTotalPagado(totalPagado + importe);
          setDetalle("");
          setImporte(0);
        } else {
          setMetodosPago([...metodosPago, metodo]);
          setPagos([...pagos, { metodoPago: metodo, importe, detalle }]);
          setTotalPagado(totalPagado + importe);
          setDetalle("");
          setImporte(0);
        }
      } else {
        setMetodosPago([...metodosPago, metodo]);
        setPagos([...pagos, { metodoPago: metodo, importe, detalle }]);
        setTotalPagado(totalPagado + importe);
        setDetalle("");
        setImporte(0);
      }
    }
  };

  useEffect(() => {
    const generatePDF = async () => {
      if (recibo && factura) {
        const doc = (
          <TransferReceipt
            numeroRecibo={`${recibo.numeroRecibo}`}
            fechaEmision={recibo.fechaEmision}
            cliente={factura.cliente}
            numeroFactura={factura.numeroFactura}
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
  }, [recibo]);

  const pagarFactura = async () => {
    const movsDetalles = pagos.map((pago) => ({
      metodoPago: pago.metodoPago,
      monto: pago.importe,
      concepto: pago.detalle,
    }));
    try {
      setLoading(true);
      const contado = factura?.esContado ? "al contado" : "a crédito ";
      const texto = `Pago de factura N° ${factura?.numeroFactura} ${contado} del cliente ${factura?.cliente.nombre}`;
      const response = await crearMovimiento({
        mov: {
          aperturaId: apertura.id,
          esIngreso: true,
          monto: totalPagado,
          facturaId: idFactura,
        },
        movsDetalles,
        concepto: `Pago de factura ${
          factura?.numeroFactura
        } por valor de ${totalPagado.toLocaleString("es-PY")} Gs.`,
      });
      if (response === undefined || typeof response === "string") {
        throw new Error(response || "Error al pagar la factura");
      }
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data?.recibo) {
        console.log(response.data.recibo.numeroRecibo);
        setRecibo(response.data.recibo);
      }
      setLoading(false);
      toast.success("Factura pagada exitosamente!");
      router.push("./");
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const guardarDatosTarjeta = (tarjeta: Tarjeta) => {
    setMetodosPago([...metodosPago, medioDePago.TARJETA]);
    setPagos([
      ...pagos,
      { metodoPago: medioDePago.TARJETA, importe, detalle, tarjeta },
    ]);
    setTotalPagado(totalPagado + importe);
    setDetalle("");
    setImporte(0);
  };

  const eliminarMetodoPago = (id: number) => {
    const nuevosMetodos = pagos.filter((pago, index) => index !== id);
    const metodoEliminado = pagos[id];
    setTotalPagado(totalPagado - metodoEliminado.importe);
    setPagos(nuevosMetodos);
    setDisabled(false);
  };

  if (!factura) {
    return <div>Cargando factura...</div>;
  }
  const detallesFactura = [
    {
      label: "Tipo de Venta:",
      value: factura.esContado ? "Contado" : "Crédito",
    },
    {
      label: "Cliente:",
      value: factura.cliente.nombre,
    },
    {
      label: "Monto:",
      value: Number(factura.total).toLocaleString("es-PY") + " Gs.",
    },
    {
      label: "Falta:",
      value:
        (
          Number(factura.total) -
          (totalPagado + Number(factura.totalSaldoPagado))
        ).toLocaleString("es-PY") + " Gs.",
    },
  ];
  return (
    <>
      <div className="px-6 rounded-md flex flex-col mx-auto mt-4">
        <h2 className="text-xl font-semibold mb-4">
          Detalles de la Factura N° {factura.numeroFactura}
          {!factura.esContado &&
            factura.fechaVencimiento &&
            " - Vencimiento: " + formatDate(factura.fechaVencimiento)}
        </h2>
        <div className="flex gap-4 items-center">
          {detallesFactura.map((detalle, index) => (
            <h3 key={index} className="text-base font-semibold mb-4 text-white">
              {detalle.label}{" "}
              <span className="text-primary-300">{detalle.value}</span>
            </h3>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-4">Agregar Método de Pago</h2>

        <div className="flex flex-col">
          <div className="mr-4 w-full flex justify-start items-center gap-4">
            <div className="mb-4 w-1/2">
              <label className="block text-base font-medium text-white mb-2">
                Método:
              </label>
              <select
                value={metodo}
                disabled={disabled}
                onChange={(e) => setMetodo(e.target.value as medioDePago)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
              >
                <option value={medioDePago.EFECTIVO}>Efectivo</option>
                <option value={medioDePago.TARJETA}>Tarjeta</option>
                <option value={medioDePago.CHEQUE}>Cheque</option>
                <option value={"Otro"}>Otro</option>
              </select>
            </div>
            <div className="mb-4 w-1/2 relative">
              <label className="block text-base font-medium text-white mb-2">
                Importe:
              </label>
              <Input
                id="importe"
                type="formattedNumber"
                value={importe}
                disabled={disabled}
                placeholder="Ingrese el importe del pago"
                onChange={(e) => setImporte(Number(e.target.value))}
                className={
                  "mt-1 block w-full px-3 py-2  rounded-md shadow-sm focus:outline-none  sm:text-sm border border-gray-300 " +
                  (error ? "border-red-500" : " focus:border-primary-600")
                }
              />
              {error && (
                <p
                  title="mensaje de error"
                  className="text-gray-200 text-sm absolute top-20"
                >
                  {error}
                </p>
              )}
            </div>
            <div className="mr-4 w-full flex justify-center flex-col mb-4">
              <label className="block text-base font-medium text-white mb-2">
                Detalle:
              </label>
              <Input
                id="detalle"
                type="text"
                value={detalle}
                disabled={disabled}
                placeholder="Especifique detalles del pago (por ejemplo,Cheque #12345)"
                onChange={(e) => setDetalle(e.target.value)}
                className="mt-1 block h-3/4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-primary-600 sm:text-sm"
              />
            </div>
          </div>
          <div className="w-full flex justify-end items-center gap-4">
            <button
              disabled={disabled || loading}
              onClick={agregarMetodoPago}
              className={
                " text-white py-2 px-4 rounded-md shadow-sm " +
                (error || loading
                  ? " cursor-not-allowed bg-primary-900"
                  : "bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900")
              }
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ModalTarjeta
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={(tarjeta) => guardarDatosTarjeta(tarjeta)}
        />
      )}

      <div className="px-6 rounded-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Métodos de Pago</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 font-semibold px-4 py-2">
                Método
              </th>
              <th className="border border-gray-300 font-semibold px-4 py-2">
                Detalle
              </th>
              <th className="border border-gray-300 font-semibold px-4 py-2">
                Importe
              </th>
              <th className="border border-gray-300 font-semibold px-4 py-2">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {pagos.length > 0 ? (
              pagos.map((pago, index) => (
                <tr key={index}>
                  <td className="border text-center border-gray-300 px-4 py-2">
                    {pago.metodoPago}
                  </td>
                  <td className="border text-center border-gray-300 px-4 py-2">
                    {pago.detalle}
                  </td>
                  <td className="border text-center border-gray-300 px-4 py-2">
                    {pago.importe.toLocaleString("es-PY")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center items-center">
                    <button onClick={() => eliminarMetodoPago(index)}>
                      <TrashIcon className="h-6 w-6 hover:text-red-600 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border text-center border-gray-300 px-4 py-2"
                  colSpan={4}
                >
                  No hay métodos de pago
                </td>
              </tr>
            )}
            <tr>
              <td
                className="border font-semibold border-gray-300 px-4 py-2"
                colSpan={3}
              >
                Total
              </td>
              <td className="border text-center font-semibold border-gray-300 px-4 py-2">
                {totalPagado.toLocaleString("es-PY")} Gs.
              </td>
            </tr>
          </tbody>
        </table>
        <div className="w-full mt-4 flex justify-center items-end flex-col">
          <button
            className={
              "bg-primary-800 text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900 " +
              (loading ? "cursor-not-allowed" : "")
            }
            onClick={async () => {
              if (factura.esContado && totalPagado !== +factura.total) {
                toast.error(
                  "El importe total no coincide con el total de la factura."
                );
                return;
              } else {
                await pagarFactura();
              }
            }}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Realizar Pago"}
          </button>
        </div>
        <Toaster richColors />
      </div>
    </>
  );
}

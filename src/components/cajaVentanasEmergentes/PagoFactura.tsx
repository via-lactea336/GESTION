import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import obtenerFacturaPorId from "@/lib/moduloCaja/factura/obtenerFacturaPorId";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { AperturaCaja, Factura, medioDePago } from "@prisma/client";
import { TrashIcon } from "@heroicons/react/24/outline";
import ModalTarjeta from "./ModalTarjeta";
import obtenerCliente from "@/lib/moduloCaja/cliente/obtenerCliente";
import crearMovimiento from "@/lib/moduloCaja/movimiento/crearMovimiento";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import Input from "../global/Input";

export default function PagoFacturas({ idFactura }: { idFactura: string }) {
  const apertura: AperturaCaja = obtenerCookie("apertura");
  const router = useRouter();

  const [factura, setFactura] = useState<Factura | null>(null);
  const [metodo, setMetodo] = useState<medioDePago>(medioDePago.EFECTIVO);
  const [detalle, setDetalle] = useState<string>("");
  const [importe, setImporte] = useState<number>(0);
  const [metodosPago, setMetodosPago] = useState<medioDePago[]>([]);
  const [totalPagado, setTotalPagado] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tarjetaTipo, setTarjetaTipo] = useState<string>("Crédito");
  const [nombreTitular, setNombreTitular] = useState<string>("");
  const [banco, setBanco] = useState<string>("Banco Itaú");
  const [loading, setLoading] = useState(false);

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
        const facturaConRuc = { ...data, ruc: cliente.docIdentidad };
        setFactura(facturaConRuc);
        setImporte(+facturaConRuc.total);
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

  const agregarMetodoPago = () => {
    if (importe <= 0) {
      alert("El importe debe ser mayor que 0");
      return;
    }

    if (metodo === medioDePago.TARJETA) {
      setModalOpen(true);
    } else {
      setMetodosPago([...metodosPago, metodo]);
      setTotalPagado(totalPagado + importe);
      setDetalle(detalle);
      setImporte(importe);
    }
  };

  const pagarFactura = async () => {
    const movsDetalles = metodosPago.map((metodo) => ({
      metodoPago: metodo,
      monto: totalPagado,
    }));
    console.log(movsDetalles);
    try {
      setLoading(true);
      const response = await crearMovimiento({
        mov: {
          aperturaId: apertura.id,
          esIngreso: true,
          monto: totalPagado,
          facturaId: idFactura,
        },
        movsDetalles,
      });
      if (response === undefined || typeof response === "string") {
        throw new Error(response || "Error al pagar la factura");
      }
      if (response.error) {
        throw new Error(response.error);
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

  const guardarDatosTarjeta = (tarjeta: {
    tipo: string;
    nombreTitular: string;
    banco: string;
  }) => {
    setMetodosPago([...metodosPago, medioDePago.TARJETA]);
    setTotalPagado(totalPagado + importe);
  };

  const eliminarMetodoPago = (id: number) => {
    const nuevosMetodos = metodosPago.filter((metodo, index) => index !== id);
    const metodoEliminado = metodosPago[id];
    setTotalPagado(totalPagado - importe);
    setMetodosPago(nuevosMetodos);
  };

  if (!factura) {
    return <div>Cargando factura...</div>;
  }

  return (
    <>
      <div className="px-6 rounded-md flex flex-col mx-auto mt-4">
        <h2 className="text-xl font-semibold mb-4">Agregar Método de Pago</h2>
        <div className="flex gap-4 items-center">
          <h2 className="text-md font-semibold mb-4 text-white">
            Monto de la Factura:{" "}
            <span className="text-primary-300">
              {Number(factura.total).toLocaleString()}
            </span>
          </h2>
          <h3 className="text-md font-semibold mb-4">
            Falta:{" "}
            <span className="text-primary-300">
              {(Number(factura.total) - totalPagado).toLocaleString()}
            </span>
          </h3>
        </div>
        <div className="flex flex-col">
          <div className="mr-4 w-full flex justify-start items-center gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Método:
              </label>
              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value as medioDePago)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
              >
                <option value={medioDePago.EFECTIVO}>Efectivo</option>
                <option value={medioDePago.TARJETA}>Tarjeta de Crédito</option>
                <option value={medioDePago.CHEQUE}>Cheque</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Importe:
              </label>
              <Input
                id="importe"
                placeholder="100000"
                type="number"
                value={importe === 0 ? "" : importe}
                onChange={(e) => setImporte(Number(e.target.value))}
                className="mt
-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div className="mr-4 w-full flex justify-center flex-col mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Detalle:
              </label>
              <input
                type="text"
                value={detalle}
                placeholder="Pago de factura al contado por productos"
                onChange={(e) => setDetalle(e.target.value)}
                className="mt-1 block h-3/4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
focus:ring-yellow-500 focus:border-primary-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="w-full flex justify-end items-center gap-4 mb-4">
            <button
              onClick={agregarMetodoPago}
              className="bg-primary-800 text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900"
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
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Método</th>
              <th className="border border-gray-300 px-4 py-2">Detalle</th>
              <th className="border border-gray-300 px-4 py-2">Importe</th>
              <th className="border border-gray-300 px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {metodosPago.map((metodo, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{index}</td>
                <td className="border border-gray-300 px-4 py-2">{metodo}</td>
                <td className="border border-gray-300 px-4 py-2">{detalle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {importe.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center items-center">
                  <button onClick={() => eliminarMetodoPago(index)}>
                    <TrashIcon className="h-6 w-6 hover:text-red-600 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 px-4 py-2" colSpan={3}>
                Total
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {totalPagado.toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
        <div className="w-full flex justify-center items-end flex-col">
          <div className="my-4 text-xl font-semibold">
            <span>Total: {totalPagado.toLocaleString()}</span>
          </div>
          <button
            className={
              "bg-primary-800 text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900 " +
              (loading ? "cursor-not-allowed" : "")
            }
            onClick={() => {
              if (factura.esContado && totalPagado !== +factura.total) {
                alert(
                  "El importe total no coincide con el total de la factura."
                );
                return;
              } else {
                pagarFactura();
              }
            }}
          >
            {loading ? "Procesando..." : "Realizar Pago"}
          </button>
        </div>
        <Toaster richColors />
      </div>
    </>
  );
}

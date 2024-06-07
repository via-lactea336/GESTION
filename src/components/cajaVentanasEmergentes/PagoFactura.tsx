"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import obtenerFacturaPorId from "@/lib/moduloCaja/factura/obtenerFacturaPorId";
import { Cajero } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { Caja, Factura } from "@prisma/client";
import { TrashIcon } from "@heroicons/react/24/outline";
import ModalTarjeta from "./ModalTarjeta";
import obtenerCliente from "@/lib/moduloCaja/cliente/obtenerCliente";

interface MetodoPago {
  id: number;
  metodo: string;
  detalle: string;
  importe: number;
}

export default function PagoFacturas({ idFactura }: { idFactura: string }) {
  const cajero: Cajero = obtenerCookie("cajero");
  const caja: Caja = obtenerCookie("caja");
  const { id_factura } = useParams();

  const [factura, setFactura] = useState<Factura | null>(null);
  const [metodo, setMetodo] = useState<string>("Efectivo");
  const [detalle, setDetalle] = useState<string>("");
  const [importe, setImporte] = useState<number>(0);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [totalPagado, setTotalPagado] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await obtenerFacturaPorId(id_factura as string);

      if (response === undefined || typeof response === "string") {
        setFactura(null);
        return;
      }

      const { success, data, error } = response;

      if (success && data) {
        const responseCliente = await obtenerCliente(data.clienteId);
        if (typeof responseCliente === "string" || responseCliente === undefined) {
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
    if (id_factura) {
      fetchData();          
    }   
  }, [id_factura]);

  const agregarMetodoPago = () => {
    if (importe <= 0) {
      alert("El importe debe ser mayor que 0");
      return;
    }

    if (metodo === "Tarjeta de Crédito") {
      setModalOpen(true);
    } else {
      const nuevoMetodo: MetodoPago = {
        id: metodosPago.length + 1,
        metodo,
        detalle,
        importe,
      };

      setMetodosPago([...metodosPago, nuevoMetodo]);
      setTotalPagado(totalPagado + importe);
      setDetalle("");
      setImporte(0);
    }
  };

  const guardarDatosTarjeta = (tarjeta: { numero: string; nombre: string; vencimiento: string; cvv: string }) => {
    const nuevoMetodo: MetodoPago = {
      id: metodosPago.length + 1,
      metodo,
      detalle: `Tarjeta: ${tarjeta.numero}, Nombre: ${tarjeta.nombre}, Vencimiento: ${tarjeta.vencimiento}`,
      importe,
    };

    setMetodosPago([...metodosPago, nuevoMetodo]);
    setTotalPagado(totalPagado + importe);
    setDetalle("");
    setImporte(0);
  };

  const eliminarMetodoPago = (id: number) => {
    const nuevosMetodos = metodosPago.filter((metodo) => metodo.id !== id);
    const metodoEliminado = metodosPago.find((metodo) => metodo.id === id);
    setTotalPagado(totalPagado - (metodoEliminado?.importe || 0));
    setMetodosPago(nuevosMetodos);
  };

  if (!factura) {
    return <div>Cargando factura...</div>;
  }

  

  return (
    <>
      <div className="p-6 shadow-md rounded-md flex flex-col mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">Agregar Método de Pago</h2>

        <div className="flex">
          <div className="mr-4 w-2/6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Método:
              </label>
              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Importe:
              </label>
              <input
                type="number"
                value={importe}
                onChange={(e) => setImporte(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"               
              />
            </div>
          </div>

          <div className="mr-4 w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Detalle:
            </label>
            <input
              type="text"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              className="mt-1 block h-3/4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            />
          </div>

          <div className="flex mb-3 items-end flex-col justify-around">
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4">Total: {+factura.total}</h2>
              <h3 className="text-xl font-semibold mb-4">Falta: {+factura.total - totalPagado}</h3>
            </div>
            <button
              onClick={agregarMetodoPago}
              className="bg-primary-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
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

      <div className="p-6 shadow-md rounded-md mx-auto mt-8">
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
            {metodosPago.map((metodo) => (
              <tr key={metodo.id}>
                <td className="border border-gray-300 px-4 py-2">{metodo.id}</td>
                <td className="border border-gray-300 px-4 py-2">{metodo.metodo}</td>
                <td className="border border-gray-300 px-4 py-2">{metodo.detalle}</td>
                <td className="border border-gray-300 px-4 py-2">{metodo.importe.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center items-center">
                  <button onClick={() => eliminarMetodoPago(metodo.id)}><TrashIcon className="h-6 w-6 hover:text-red-600 text-gray-500" /></button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 px-4 py-2" colSpan={3}>
                Total
              </td>
              <td className="border border-gray-300 px-4 py-2">{totalPagado.toLocaleString()}</td>
              <td className="border border-gray-300 px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 text-xl font-semibold">
          <span>Total: {totalPagado.toLocaleString()}</span>
        </div>
        <button 
          className="bg-primary-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 "
          onClick={() => {
            if (factura.esContado && totalPagado !== +factura.total) {
              alert("El importe total no coincide con el total de la factura.");
              return;
            }}}
          >
          Siguiente
        </button>
      </div>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import obtenerOperacionPorId from "../../../../../lib/operacion/obtenerOperacionPorId";

export default function Page() {
  const [dateTime, setDateTime] = useState("undefined");
  const [monto, setMonto] = useState("0");
  const [numComprobante, setNumComprobante] = useState("undefined");
  const [concepto, setConcepto] = useState("undefined");
  const [nombreDestino, setNombreDestino] = useState("undefined");
  const [numCuentaDestino, setNumCuentaDestino] = useState("undefined");
  const [bancoDestino, setBancoDestino] = useState("undefined");
  const [nombreOrigen, setNombreOrigen] = useState("undefined");
  const [numCuentaOrigen, setNumCuentaOrigen] = useState("undefined");

  const { idMov } = useParams();
  const router = useRouter();

  const getTransferencia = async () => {
    const data = await obtenerOperacionPorId(idMov as string);
    console.log(data);

    if (
      data == undefined ||
      typeof data === "string" ||
      data.success === false
    ) {
      router.push("not-found");
      return;
    }

    const fechaHora = new Date(data.data.fechaOperacion);
    const formattedDateTime = fechaHora.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setDateTime(formattedDateTime);
    const formattedMonto = data.data.monto.toLocaleString("es-PY", {
      style: "currency",
      currency: "PYG",
    });
    setMonto(formattedMonto);
    setNumComprobante(data.data.numeroComprobante);
    setConcepto(data.data.concepto);
    setNombreDestino(data.data.nombreInvolucrado);
    setNumCuentaDestino(data.data.cuentaInvolucrado);
    setBancoDestino(data.data.bancoInvolucrado);
    //setNombreOrigen(data.data.cuentaBancariaOrigen);
    setNumCuentaOrigen(data.data.cuentaBancariaOrigenId);
  };

  useEffect(() => {
    getTransferencia();
  });

  const handleCloseButtonClick = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-1/2 py-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold pb-4">
          Comprobante de Transferencia
        </h1>
        <div className="flex items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-calendar-clock"
          >
            <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h5" />
            <path d="M17.5 17.5 16 16.3V14" />
            <circle cx="16" cy="16" r="6" />
          </svg>
          <p className="text-lg px-2">Fecha: {dateTime}</p>
        </div>
      </div>
      <div className="w-1/2 py-4 border-b border-gray-300">
        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Monto:</p>
          <p className="w-2/3 text-base text-right">{monto}</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Comprobante:</p>
          <p className="w-2/3 text-base text-right">{numComprobante}</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Concepto:</p>
          <p className="w-2/3 text-base text-right">{concepto}</p>
        </div>
      </div>

      <div className="w-1/2 pb-4 border-b border-gray-300">
        <div className="flex items-center border mb-2 px-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-hand-coins"
          >
            <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
            <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
            <path d="m2 16 6 6" />
            <circle cx="16" cy="9" r="2.9" />
            <circle cx="6" cy="5" r="3" />
          </svg>
          <p className="text-lg px-2">Destino</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Nombre:</p>
          <p className="w-2/3 text-base text-right">{nombreDestino}</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Cuenta:</p>
          <p className="w-2/3 text-base text-right">{numCuentaDestino}</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Banco:</p>
          <p className="w-2/3 text-base text-right">{bancoDestino}</p>
        </div>
      </div>
      <div className="w-1/2 pb-4 border-b border-gray-300">
        <div className="flex items-center border mb-2 px-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-banknote"
          >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
          <p className="text-lg px-2">Origen</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Nombre:</p>
          <p className="w-2/3 text-base text-right">{nombreOrigen}</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Cuenta:</p>
          <p className="w-2/3 text-base text-right">{numCuentaOrigen}</p>
        </div>
      </div>
      <div className="w-1/2 py-4 border-gray-300">
        <div className="flex flex-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="blue"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-badge-info"
          >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <line x1="12" x2="12" y1="16" y2="12" />
            <line x1="12" x2="12.01" y1="8" y2="8" />
          </svg>
          <p className="pb-4 px-2">No válido como comprobante legal</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleCloseButtonClick}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

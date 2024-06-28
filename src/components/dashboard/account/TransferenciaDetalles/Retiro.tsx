"use client";

import React from "react";

interface Props {
  tipoOperacion: string;
  tipoOperacionNombre: string;
  dateTime: string;
  monto: string;
  numComprobante: string;
  concepto: string;
  nombreDestino?: string;
  numCuentaDestino?: string;
  bancoDestino?: string;
  nombreOrigen?: string;
  numCuentaOrigen?: string;
  bancoOrigen?: string;
  ruc?: string | null;
}

const RetiroDinero: React.FC<Props> = ({
  tipoOperacion,
  tipoOperacionNombre,
  dateTime,
  monto,
  numComprobante,
  concepto,
  nombreDestino,
  numCuentaDestino,
  bancoDestino,
  nombreOrigen,
  numCuentaOrigen,
  bancoOrigen,
  ruc,
}) => {
  return (
    <>
      <div className="w-1/2 py-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold pb-4">Detalles - Retiro de Dinero</h1>
        <div className="flex items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
          <p className="w-1/3 text-base">Nombre del Titular:</p>
          <p className="w-2/3 text-base text-right">{nombreOrigen}</p>
        </div>

        <div className="flex justify-between w-full">
          <p className="w-1/3 text-base">Monto retirado:</p>
          <p className="w-2/3 text-base text-right">
            {Number(monto).toLocaleString("es-PY")}
          </p>
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

      {nombreDestino == null &&
      numCuentaDestino == null &&
      bancoDestino == null ? null : (
        <div className="w-1/2 pb-4 border-b border-gray-300">
          <div className="flex items-center border mb-2 px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-hand-coins"
            >
              <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
              <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
              <path d="m2 16 6 6" />
              <circle cx="16" cy="9" r="2.9" />
              <circle cx="6" cy="5" r="3" />
            </svg>
            <p className="text-lg px-2">Persona que retiró el dinero</p>
          </div>
          {nombreDestino && (
            <div className="flex justify-between w-full">
              <p className="w-1/3 text-base">Nombre:</p>
              <p className="w-2/3 text-base text-right">{nombreDestino}</p>
            </div>
          )}
          <div className="flex justify-between w-full">
            <p className="w-1/3 text-base">RUC:</p>
            <p className="w-2/3 text-base text-right">{ruc}</p>
          </div>
          {numCuentaDestino && (
            <div className="flex justify-between w-full">
              <p className="w-1/3 text-base">Cuenta:</p>
              <p className="w-2/3 text-base text-right">{numCuentaDestino}</p>
            </div>
          )}
          {bancoDestino && (
            <div className="flex justify-between w-full">
              <p className="w-1/3 text-base">Banco:</p>
              <p className="w-2/3 text-base text-right">{bancoDestino}</p>
            </div>
          )}
        </div>
      )}

      {nombreOrigen == null &&
      numCuentaOrigen == null &&
      bancoOrigen == null ? null : (
        <div className="w-1/2 pb-4 border-b border-gray-300">
          <div className="flex items-center border mb-2 px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-banknote"
            >
              <rect width="20" height="12" x="2" y="6" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M6 12h.01M18 12h.01" />
            </svg>
            <p className="text-lg px-2">Detalles de la cuenta</p>
          </div>

          {numCuentaOrigen && (
            <div className="flex justify-between w-full">
              <p className="w-1/3 text-base">Cuenta:</p>
              <p className="w-2/3 text-base text-right">{numCuentaOrigen}</p>
            </div>
          )}
          {bancoOrigen && (
            <div className="flex justify-between w-full">
              <p className="w-1/3 text-base">Banco:</p>
              <p className="w-2/3 text-base text-right">{bancoOrigen}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RetiroDinero;

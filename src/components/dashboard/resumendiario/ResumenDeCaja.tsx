"use client";
import React from "react";
import { AperturaCaja, RegistroCaja } from "@prisma/client";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { Caja } from "@prisma/client";
import { Cajero } from "@/lib/definitions";

const ResumenDeCaja: React.FC<RegistroCaja> = ({
  montoRegistrado,
  montoIngreso,
  montoIngresoCheque,
  montoIngresoTarjeta,
  createdAt,
}) => {
  const caja: Caja = obtenerCookie("caja");
  const cajero: Cajero = obtenerCookie("cajero");
  const apertura: AperturaCaja = obtenerCookie("apertura");

  const fecha = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="mb-4 font-semibold text-lg">Resumen de Caja</h2>

        <p className="">
          <span className="font-semibold">Fecha y Hora:</span>
          {"  "}
          {new Date(createdAt)
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")}{" "}
          {new Date(createdAt).getHours()}:{new Date(createdAt).getMinutes()}
        </p>
      </div>
      <table className="border-collapse bg-gray-700 table-fixed mx-auto w-full">
        <tbody>
          <tr className="bg-gray-900 py-1 px-2 border-b-2 border-gray-700">
            <td className="p-2 text-primary-300">Caja Inicial</td>
            <td className="p-2">
              {Number(apertura?.saldoInicial).toLocaleString()} Gs.
            </td>
          </tr>
          <tr className="bg-gray-900 py-1 px-2 rounded">
            <td className="p-2 text-primary-300">Dinero en Caja</td>
            <td className="p-2">
              {Number(montoRegistrado).toLocaleString()} Gs.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className=" my-4 font-semibold text-lg">
        Resumen de ingresos y egresos por forma de pago
      </h2>

      <table className="border-collapse table-auto mx-auto text-center w-full">
        <thead>
          <tr className="bg-gray-900 py-1 px-2">
            <th className="p-2 w-1/5 font-normal text-primary-300">
              Forma de Pago
            </th>
            <th className="p-2 w-1/5 font-normal text-primary-300">Ingreso</th>
          </tr>
        </thead>
        <tbody className="">
          <tr className="border-b-2 border-gray-700">
            <td className="p-2">Efectivo</td>
            <td className="p-2">{Number(montoIngreso).toLocaleString()} Gs.</td>
          </tr>
          <tr className="border-b-2 border-gray-700">
            <td className="p-2">Cheque</td>
            <td className="p-2">
              {Number(montoIngresoCheque).toLocaleString()} Gs.
            </td>
          </tr>
          <tr className="border-b-2 border-gray-700">
            <td className="p-2">Tarjetas</td>
            <td className="p-2">
              {Number(montoIngresoTarjeta).toLocaleString()} Gs.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResumenDeCaja;

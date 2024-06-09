"use client";
import React from "react";
import { DatosExtendidosRegistroCaja } from "@/lib/definitions";

const ResumenDeCaja: React.FC<DatosExtendidosRegistroCaja> = ({
  montoRegistrado,
  montoIngresoEfectivo,
  montoIngresoCheque,
  montoIngresoTarjeta,
  createdAt,
  apertura,
  montoInicial
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="mb-4 font-semibold text-lg">Resumen de Caja</h2>

        <p>
          <span className="font-semibold mr-2">Generado el </span>
          <span className="font-semibold mr-2">
            {new Date(createdAt)
              .toISOString()
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}{" "} a las 
          </span>
          <span className="font-semibold mr-2"> 
            {new Date(createdAt).getHours()}:{new Date(createdAt).getMinutes()}
          </span>
        </p>
      </div>
      <table className="border-collapse bg-gray-700 table-fixed mx-auto w-full">
        <tbody>
          <tr className="bg-gray-900 py-1 px-2 border-b-2 border-gray-700">
            <td className="p-2 text-primary-300">Caja Inicial</td>
            <td className="p-2">
              {Number(montoInicial).toLocaleString()} Gs.
            </td>
          </tr>
          <tr className="bg-gray-900 py-1 px-2 border-b-2 border-gray-700">
            <td className="p-2 text-primary-300">Dinero en Caja</td>
            <td className="p-2">
              {Number(montoRegistrado).toLocaleString()} Gs.
            </td>
          </tr>
          <tr className="bg-gray-900 py-1 px-2 rounded">
            <td className="p-2 text-primary-300">Oberservaciones</td>
            <td className="p-2">
              {apertura.observaciones == ""? "Sin observaciones durante el cierre" :  apertura.observaciones}
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
            <td className="p-2">{Number(montoIngresoEfectivo).toLocaleString()} Gs.</td>
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

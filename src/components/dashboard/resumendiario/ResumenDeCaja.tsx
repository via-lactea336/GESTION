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

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="mb-4 font-semibold text-lg">Resumen de Caja</h2>

        <p>
          <span className="font-semibold mr-2">Generado el </span>
          <span className="font-semibold mr-2">
            {formatDate(createdAt)}{" "} a las 
          </span>
          <span className="font-semibold mr-2"> 
            {formatTime(createdAt)}
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
            <td className="p-2 text-primary-300">Observaciones</td>
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

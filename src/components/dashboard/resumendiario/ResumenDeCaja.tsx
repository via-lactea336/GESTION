"use client";
import React from 'react';
import { AperturaCaja, RegistroCaja } from '@prisma/client';
import { obtenerCookie } from '@/lib/obtenerCookie';
import { Caja } from '@prisma/client';
import { Cajero } from '@/lib/definitions';

const ResumenDeCaja: React.FC<RegistroCaja> = ({
  id,
  aperturaId,
  montoRegistrado,
  montoEsperado,
  montoInicial,
  cantCheques,
  cantTarjetas,
  montoIngreso,
  montoEgreso,
  montoIngresoCheque,
  montoEgresoCheque,
  montoIngresoTarjeta,
  montoEgresoTarjeta,
  createdAt,
  updatedAt,
  
}) => {
  const caja:Caja = obtenerCookie("caja")
  const cajero: Cajero = obtenerCookie("cajero")
  const apertura: AperturaCaja = obtenerCookie("apertura")

  const fecha= new Date().toISOString().split("T")[0]

  return (
    
    
    <div className="mb-6 bg-gray-700 shadow-lg p-6">
      <h2 className="mb-4 font-bold">Resumen de Caja</h2>
      <div className="flex justify-between space-x-8 mb-4">
        <p className="text-white">Fecha: {new Date(createdAt).toLocaleDateString()}</p>
        <p className="p-2">
          Hora: {new Date(createdAt).getHours()}:{new Date(createdAt).getMinutes()}
        </p>
        <p className="text-white">Caja: {caja.numero}</p>
        <p className="text-white">Cajero: {cajero.nombre}</p>
      </div>
      <table className="border-collapse border border-black table-fixed mx-auto w-full">
        <tbody>
          <tr>
            <td className="p-2">Caja Inicial</td>
            <td className="p-2">{Number(apertura?.saldoInicial).toLocaleString()} Gs.</td>
          </tr>
          <tr>
            <td className="p-2">Dinero en Caja</td>
            <td className="p-2">{Number(montoRegistrado).toLocaleString()} Gs.</td>
          </tr>
        </tbody>
      </table>


      <h2 className=" mb-4 font-bold mt-10">Resumen de ingresos y egresos por forma de pago</h2>

      <table className="border-collapse border border-black table-auto mx-auto text-center w-full">
        <thead>
          <tr>
            <th className="p-2 w-1/5">Forma de Pago</th>
            <th className="p-2 w-1/5">Ingreso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Efectivo</td>
            <td className="p-2">{Number(montoIngreso).toLocaleString()} Gs.</td>
          </tr>
          <tr>
            <td className="p-2">Cheque</td>
            <td className="p-2">{Number(montoIngresoCheque).toLocaleString()} Gs.</td>
          </tr>
          <tr>
            <td className="p-2">Tarjetas</td>
            <td className="p-2">{Number(montoIngresoTarjeta).toLocaleString()} Gs.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResumenDeCaja;
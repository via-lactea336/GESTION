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
      <div className="flex space-x-8 mb-4">
        <p className="text-white">Fecha: {fecha}</p>
        <p className="text-white">Caja: {caja.numero}</p>
        <p className="text-white">Cajero: {cajero.nombre}</p>
      </div>
      <table className="border-collapse border border-black table-fixed mx-auto w-full">
        <tbody>
          <tr>
            <td className="p-2">Estado</td>
            <td className="p-2">{aperturaId}</td>
          </tr>
          <tr>
            <td className="p-2">Caja Inicial</td>
            <td className="p-2">{Number(apertura?.saldoInicial)}</td>
          </tr>
          <tr>
            <td className="p-2">Dinero en Caja</td>
            <td className="p-2">{`${montoRegistrado}`}</td>
          </tr>
       
        </tbody>
      </table>
    
      
    <div className="mb-6 bg-gray-700 shadow-lg p-6">
      <h2 className=" mb-4 font-bold">Resumen de ingresos y egresos por forma de pago</h2>

      <table className="border-collapse border border-black table-auto mx-auto text-center w-full">
        <thead>
          <tr>
            <th className="p-2 w-1/5">Forma de Pago</th>
     
            <th className="p-2 w-1/5">Ingreso</th>
            <th className="p-2 w-1/5">Egreso</th>
            <th className="p-2 w-1/5">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Efectivo</td>
    
            <td className="p-2">{`${montoIngreso}`}</td>
            <td className="p-2">{`${montoEgreso}`}</td> 
            <td className="p-2">{`${montoIngreso}`}</td>
          </tr>
          <tr>
            <td className="p-2">Cheque</td>
  
            <td className="p-2">{`${montoIngresoCheque}`}</td>
            <td className="p-2">{`${montoEgresoCheque}`}</td> 
            <td className="p-2">0</td>
          </tr>
          <tr>
            <td className="p-2">Tarjetas</td>
            <td className="p-2">{`${montoIngresoTarjeta}`}</td>
            <td className="p-2">{`${montoEgresoTarjeta}`}</td> 
            <td className="p-2">0</td>
          </tr>
          
        </tbody>
      </table>
    </div>
    </div>
    
  );
}

export default ResumenDeCaja;

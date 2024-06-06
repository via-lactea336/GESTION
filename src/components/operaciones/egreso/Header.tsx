"use client"
import React from "react";
import { obtenerCookie } from '@/lib/obtenerCookie';
import { Caja } from '@prisma/client';
import { Cajero } from '@/lib/definitions';

const Header: React.FC = () => {
  const caja: Caja = obtenerCookie("caja");
  const cajero: Cajero = obtenerCookie("cajero");
  const fechaActual = new Date()
  .toISOString()
  .split("T")[0]
  .split("-")
  .reverse()
  .join("-")
  return (
    <header className="flex gap-3 justify-between items-center flex-wrap px-8 py-4 w-full rounded-md bg-primary-800 text-white">
      <h1 className="text-2xl font-bold">Egreso</h1>
      <div className="flex items-center gap-6"> 
        <p className="mr-4">Caja: {caja.numero}</p>
        <p className="mr-4">Cajero: {cajero.nombre}</p>
        <p className="mr-4">Fecha: {fechaActual}</p>
      </div>
    </header>
  );
}

export default Header;
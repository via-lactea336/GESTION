"use client";
import FormApertura from "@/components/cajaVentanasEmergentes/FormApertura";
import { Modal } from "@/components/global/Modal";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";

export default function Page() {
  const datos = {
    cajas: [
      {
        nombreCaja: "Caja1",
        esActiva: false,
        id: "1",
      },
      {
        nombreCaja: "Caja2",
        esActiva: false,
        id: "2",
      },
      {
        nombreCaja: "Caja3",
        esActiva: false,
        id: "3",
      },
    ],
    nombreCuenta: "Belencita Uwu",
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(true);
    setSelectedId(e.currentTarget.id);
  };
  return (
    <div className="relative">
      <header className="flex gap-3 justify-between items-center flex-wrap px-8 py-4 -mt-8 w-full rounded-md bg-primary-800 text-white">
        <h1 className="text-2xl font-bold">Punto de venta</h1>
        <nav className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <h3 className="mr-2">Vendedor/a: Belencita Uwu</h3>
          </div>
        </nav>
      </header>
      <div
        className={
          showModal ? "blur-sm brightness-50" : "text-center text-white"
        }
      >
        <div className="text-black flex ml-20 mr-20 mt-10">
          <div className="flex-1 px-4 py-2 rounded-md bg-primary-400 m-5 pt-5 pb-5">
            N° Caja
          </div>
          <div className="flex-1 px-4 py-2 rounded-md bg-primary-400 m-5 ml-10 mr-10 pt-5 pb-5">
            Estado
          </div>
          <div className="flex-1 px-4 py-2 rounded-md bg-primary-400 m-5 pt-5 pb-5">
            Ingresar
          </div>
        </div>
        <div className="text-gray-200 flex flex-col">
          {datos.cajas?.map((caja, i) => (
            <div key={i} className="flex ml-20 mr-20">
              <div className="flex-1 px-4 py-2 rounded-md bg-gray-700 m-5 pt-3 pb-3">
                {caja.nombreCaja}
              </div>
              <div className="flex-1 px-4 py-2 rounded-md bg-gray-700 m-5 ml-10 mr-10 pt-3 pb-3">
                {caja.esActiva ? "Activa" : "Cerrada"}
              </div>
              <button
                onClick={handleClick}
                id={caja.id}
                className="flex-1 px-4 py-2 rounded-md bg-gray-700 m-5 ml-10 mr-10 pt-3 pb-3 hover:bg-gray-800"
              >
                Abrir caja
              </button>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="absolute top-1/3 w-full">
          <Modal setShowModal={setShowModal}>
            <FormApertura id={selectedId} />
          </Modal>
        </div>
      )}
    </div>
  );
}

"use client";
import FormApertura from "@/components/cajaVentanasEmergentes/FormApertura";
import ListaDeCajas from "@/components/dashboard/caja/ListaDeCajas";
import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import { Modal } from "@/components/global/Modal";
import obtenerCajas from "@/lib/cajas/obtenerCajas";
import verificarApiResponse from "@/lib/verificarApiResponse";
import { Caja } from "@prisma/client";
import React, { useState, useEffect, useCallback } from "react";

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [data, setData] = useState<Caja[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(true);
    setSelectedId(e.currentTarget.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await obtenerCajas();
      const { data, mensaje, success } = verificarApiResponse(response);
      setData(data);
      setMensaje(mensaje);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div className="relative">
      <header className="flex gap-3 justify-between items-center flex-wrap px-8 py-4 -mt-8 w-full rounded-md bg-primary-800 text-white">
        <h1 className="text-2xl font-bold">Punto de venta</h1>
        <nav className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <h3 className="mr-2">
              Fecha : {new Date().toISOString().split("T")[0]}
            </h3>
          </div>
        </nav>
      </header>
      <div
        className={
          showModal ? "blur-sm brightness-50" : "text-center text-white"
        }
      >
        <div className="text-black flex mt-10">
          <div className="flex-1 px-4 py-2 rounded-md bg-primary-400 pt-5 pb-5">
            N° Caja
          </div>
          <div className="flex-1 px-4 py-2 rounded-md bg-primary-400 ml-10 mr-10 pt-5 pb-5">
            Estado
          </div>
          <div className="flex-1 px-4 py-2 rounded-md bg-primary-400 pt-5 pb-5">
            Ingresar
          </div>
        </div>
        <ListaDeCajas
          data={data}
          mensaje={mensaje}
          loading={loading}
          handleClick={handleClick}
        />
      </div>
      {showModal && (
        <div className="absolute top-1/3 w-full">
          <Modal setShowModal={setShowModal}>
            <FormApertura
              id={selectedId}
              cajeroId="881cce88-db5a-4de1-babf-a793e08817a7"
            />
          </Modal>
        </div>
      )}
    </div>
  );
}

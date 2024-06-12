"use client";

import FormApertura from "@/components/cajaVentanasEmergentes/FormApertura";
import { Modal } from "@/components/global/Modal";
import ListaDeCajas from "./ListaDeCajas";
import obtenerCajas from "@/lib/moduloCaja/cajas/obtenerCajas";
import verificarApiResponse from "@/lib/verificarApiResponse";
import { Caja } from "@prisma/client";
import { useState, useEffect } from "react";
import { CajaData } from "@/lib/definitions";
import { useRouter } from "next/navigation";

type Props = {
  cajeroId: string;
  cajeroNombre: string;
};

export default function ContenedorCajas({ cajeroId, cajeroNombre }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState<Caja>({} as Caja);
  const [data, setData] = useState<Caja[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = e.currentTarget.id;
    const caja = data.find((c) => c.id === id);
    if (caja) setSelectedCaja(caja);
    if (caja?.estaCerrado) {
      setShowModal(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await obtenerCajas();
      const { data, mensaje, success } = verificarApiResponse(response);
      if (Array.isArray(data) && data.length > 0) setData(data);
      setMensaje(mensaje);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div>
      <div
        className={
          showModal
            ? "blur-sm brightness-50 flex mt-10"
            : "flex mt-10 text-center text-white"
        }
      >
        <div className="flex-1 px-4 py-2 rounded-md bg-primary-700 pt-5 pb-5">
          N° Caja
        </div>
        <div className="flex-1 px-4 py-2 rounded-md bg-primary-700 ml-10 mr-10 pt-5 pb-5">
          Estado
        </div>
        <div className="flex-1 px-4 py-2 rounded-md bg-primary-700 pt-5 pb-5">
          Ingresar
        </div>
      </div>
      <ListaDeCajas
        data={data}
        mensaje={mensaje}
        loading={loading}
        handleClick={handleClick}
        className={showModal ? "blur-sm brightness-50" : ""}
      />
      {showModal && (
        <div className="absolute top-1/4 w-full">
          <Modal setShowModal={setShowModal}>
            <FormApertura
              caja={selectedCaja}
              cajeroId={cajeroId}
              cajeroNombre={cajeroNombre}
            />
          </Modal>
        </div>
      )}
    </div>
  );
}

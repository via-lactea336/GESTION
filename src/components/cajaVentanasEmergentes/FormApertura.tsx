"use client";
import Input from "@/components/global/Input";
import InputCalendar from "@/components/global/InputCalendar";
import crearApertura from "@/lib/aperturaCaja/crearApertura";
import { AperturaCajaData } from "@/lib/definitions";
import verificarApiResponse from "@/lib/verificarApiResponse";
import { AperturaCaja, Caja } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import LoadingCirleIcon from "../global/LoadingCirleIcon";

type Params = {
  id: string;
  cajeroId: string;
};

export default function FormApertura({ id, cajeroId }: Params) {
  const initialData = {
    cajaId: id,
    cajeroId: cajeroId,
    apertura: new Date(),
    saldoInicial: 0,
    observaciones: "",
  };
  const [data, setData] = useState<AperturaCajaData>(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await crearApertura(data);
    const { success, mensaje } = verificarApiResponse(response);
    if (success) {
      toast.success(mensaje);
      setLoading(false);
      router.push(`/dashboard/caja/${id}/ingreso`);
    } else {
      setLoading(false);
      toast.message(mensaje);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="monto">Monto de Apertura</label>
        <Input
          className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
          id="saldoInicial"
          type="number"
          placeholder="150000"
          required
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="observacion">Observación</label>
        <Input
          id="observaciones"
          type="text"
          placeholder="Caja abierta luego de actualizar el sistema"
          onChange={handleChange}
          className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [max-h-40] resize-none"
        />
      </div>
      <button
        type="submit"
        className="bg-primary-800 p-2 rounded-md text-white hover:bg-primary-700 transition-all duration-300 ease-in-out"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-4">
            Abriendo Caja... <LoadingCirleIcon className="animate-spin" />
          </span>
        ) : (
          <span>Abrir Caja</span>
        )}
      </button>
      <Toaster richColors />
    </form>
  );
}

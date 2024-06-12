"use client";
import Input from "@/components/global/Input";
import crearApertura from "@/lib/moduloCaja/aperturaCaja/crearApertura";
import { AperturaCajaData, CajaData } from "@/lib/definitions";
import verificarApiResponse from "@/lib/verificarApiResponse";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import LoadingCirleIcon from "../global/LoadingCirleIcon";
import Cookie from "js-cookie";
import { AperturaCaja, ArqueoDeCaja, Caja } from "@prisma/client";
import { obtenerCookie } from "@/lib/obtenerCookie";
type Params = {
  caja: Caja;
  cajeroId: string;
  cajeroNombre: string;
};


const caja: Caja = obtenerCookie("caja");
export default function FormApertura({ caja, cajeroId, cajeroNombre }: Params) {
  const initialData = {
    cajaId: caja.id,
    cajeroId: cajeroId,
    apertura: new Date(),
    saldoInicial: 0,
    observaciones: "",
  };
  const [dataApertura, setDataApertura] =
    useState<AperturaCajaData>(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await crearApertura(dataApertura);
    const { success, mensaje, data } =
      verificarApiResponse<AperturaCaja>(response);
    if (success) {
      toast.success(mensaje);
      setLoading(false);
      const cajero = {
        id: cajeroId,
        nombre: cajeroNombre,
      };
      // crear una cookie con los datos de la caja
      Cookie.set("cajero", JSON.stringify(cajero), {
        expires: 100,
      });
      caja.estaCerrado = false;
      Cookie.set("caja", JSON.stringify(caja), { expires: 100 });
      if (data[0]) {
        Cookie.set("apertura", JSON.stringify(data[0]), { expires: 100 });
      }
      router.push(`/dashboard/caja/${caja.id}/ingreso`);
    } else {
      setLoading(false);
      toast.message(mensaje);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataApertura((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
      <p className="font-sans text-xl text-white bg-primary-400 py-3 px-6 my-2 rounded shadow-lg text-center">Caja N° {caja.numero}</p>
        <p className="font-sans text-xl mb-4 text-white  text-center">
          Caja N° {caja.numero}
        </p>
        <label htmlFor="monto">Monto de Apertura</label>
        <Input
          className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
          id="saldoInicial"
          type="formattedNumber"
          placeholder="Ingrese el monto de apertura"
          value={dataApertura.saldoInicial}
          type="formattedNumber"
          placeholder="Ingrese el monto de apertura"
          required
          onChange={(e) => {
            setDataApertura({
              ...dataApertura,
              saldoInicial: Number(e.target.value),
            });
          }}
          onChange={handleChange}
          
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="observacion">Observación</label>
        <Input
          id="observaciones"
          type="text"
          placeholder="Observaciones..."
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

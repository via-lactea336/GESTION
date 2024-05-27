"use client";
import Input from "@/components/global/Input";
import InputCalendar from "@/components/global/InputCalendar";
import { useParams, useRouter } from "next/navigation";

export default function FormApertura() {
  const router = useRouter();
  const { id } = useParams();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/dashboard/caja/${id}/ingreso`);
  };
  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="monto">Monto de Apertura</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="monto"
            type="number"
            placeholder="150000"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="fecha">Fecha</label>
          <InputCalendar
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="fecha"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="observacion">Observación</label>
        <textarea
          id="observacion"
          name="observacion"
          placeholder="Observación"
          className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [max-h-40] resize-none"
        />
      </div>
      <button
        type="submit"
        className="bg-primary-800 p-2 rounded-md text-white hover:bg-primary-700 transition-all duration-300 ease-in-out"
      >
        Iniciar Caja
      </button>
    </form>
  );
}

"use client";
import cerrarCajaAdmin from "@/lib/moduloCaja/aperturaCaja/cerrarCajaAdmin";
import { useRouter } from "next/navigation";
import PasswordField from "../auth/PasswordField";
import { AperturaCaja, Caja } from "@prisma/client";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import Cookies from "js-cookie";

export default function FormArqueo() {
  const router = useRouter();
  const caja: Caja = obtenerCookie("caja");
  const apertura: AperturaCaja = obtenerCookie("apertura");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;
    const observaciones = e.currentTarget.observaciones.value;

    const res = await cerrarCajaAdmin(
      caja.id,
      apertura.id,
      observaciones,
      username,
      password
    );
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.message);
      Cookies.remove("cajero");
      Cookies.remove("caja");
      Cookies.remove("apertura");
      setTimeout(() => {
        router.push(`/dashboard/caja/reportes/${apertura.id}`);
      }, 2000);
    }
  };

  return (
    <div>
      <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
        <h3 className="text-center max-w-80 mx-auto">
          Para continuar con el cierre ingrese la contraseña de autorizacion del
          gerente
        </h3>
        <div className="space-y-3 flex items-center gap-3 justify-center">
          <div className="mt-3">
            <label
              className="mb-3 mt-5 block text-primary-200"
              htmlFor="username"
            >
              Nombre de usuario
            </label>
            <div className="relative">
              <input
                className="w-full bg-gray-800 rounded-lg py-[9px] pl-10"
                id="username"
                type="text"
                name="username"
                placeholder="Ingrese su nombre"
                autoComplete="name"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300" />
            </div>
          </div>
          <PasswordField
            className="bg-gray-800"
            label="Contraseña"
            name="password"
            placeholder="Contraseña"
            validate={false}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="observacion" className="text-primary-200">
            Observación
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            placeholder="Observación"
            className="block w-full bg-gray-800 rounded-md py-3 px-6 my-2 leading-tight focus:outline-none [max-h-40] resize-none"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-800 p-2 rounded-md text-white hover:bg-primary-700 transition-all duration-300 ease-in-out"
        >
          {loading ? "Cerrando..." : "Finalizar Cierre"}
        </button>
      </form>
      <Toaster richColors />
    </div>
  );
}

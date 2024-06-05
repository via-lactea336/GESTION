"use client";
import cerrarCajaAdmin from "@/lib/aperturaCaja/cerrarCajaAdmin";
import { login } from "@/lib/auth/login";
import { useRouter } from "next/navigation";
import PasswordField from "../auth/PasswordField";
import { AperturaCaja, Caja } from "@prisma/client";
import { obtenerCookie } from "@/lib/obtenerCookie";

export default function FormArqueo() {
  const router = useRouter();
  const caja: Caja = obtenerCookie("caja");
  const apertura: AperturaCaja = obtenerCookie("apertura");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;
    const observaciones = e.currentTarget.observaciones.value;
    const error = await login({ username, password });
    if (!error) {
      const res = await cerrarCajaAdmin(caja.id, apertura.id, observaciones);
      router.push("/dashboard/caja");
    } else {
      throw new Error(error);
    }
  };

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <h1 className="text-center text-2xl">
        Hubo un error durante el cierre de caja
      </h1>
      <p className="text-sm text-center">
        Para continuar con el cierre ingrese la contraseña de autorizacion del
        gerente
      </p>
      <div className="flex justify-between items-center gap-4 mt-10">
        <div className="flex flex-col gap-2">
          <label className="mt-5 block text-primary-200" htmlFor="monto">
            Usuario
          </label>
          <input
            className="w-full bg-gray-800 rounded-lg py-[9px] pl-10"
            id="username"
            type="text"
            name="username"
            placeholder="Ingrese su nombre"
            autoComplete="name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <PasswordField
            label="Contraseña"
            name="password"
            placeholder="Contraseña"
            validate={false}
            className="bg-gray-800"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="observacion">Observación</label>
        <textarea
          id="observaciones"
          name="observaciones"
          placeholder="Observación"
          className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [max-h-40] resize-none"
        />
      </div>
      <button
        type="submit"
        className="bg-primary-800 p-2 rounded-md text-white hover:bg-primary-700 transition-all duration-300 ease-in-out"
      >
        Finalizar Cierre
      </button>
    </form>
  );
}

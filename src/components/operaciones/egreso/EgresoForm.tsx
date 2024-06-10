"use client";
import React, { useState } from "react";
import { login } from "@/lib/auth/login";
import crearMovimiento from "@/lib/moduloCaja/movimiento/crearMovimiento";
import { AperturaCaja } from "@prisma/client";
import { obtenerCookie } from "@/lib/obtenerCookie";
import ComprobanteEgreso, {
  generatePDF,
} from "@/components/PDF/ComprobanteEgreso";
import { Caja } from "@prisma/client";
import { Cajero } from "@/lib/definitions";
import { getCurrentDate } from "@/lib/getCurrentDate";
import { Toaster, toast } from "sonner";
import Input from "@/components/global/Input";
import PasswordField from "@/components/auth/PasswordField";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { crearMovimientoAndRevalidate } from "@/lib/actions";
import useCookies from "@/lib/hooks/useCookies";

const Extraccion: React.FC = () => {
  const { caja, cajero } = useCookies();
  const [cantidad, setCantidad] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [mostrarComprobante, setMostrarComprobante] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apertura: AperturaCaja = obtenerCookie("apertura");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await solicitarExtraccion();
    setLoading(false);
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario(e.target.value);
  };

  const handleContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContrasena(e.target.value);
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(Number(e.target.value));
  };

  const handleObservacionesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setObservaciones(e.target.value);
  };

  const solicitarExtraccion = async () => {
    try {
      const result = await crearMovimientoAndRevalidate({
        mov: {
          aperturaId: apertura.id,
          esIngreso: false,
          monto: Number(cantidad),
        },
        movsDetalles: [
          {
            metodoPago: "EFECTIVO",
            monto: Number(cantidad),
          },
        ],
        username: usuario,
        password: contrasena,
        concepto: observaciones,
      });

      if (typeof result === "string" || result === undefined) {
        throw new Error(result || "Error al realizar la extracción");
      } else {
        if (result.error) throw new Error(result.error);
        setMostrarComprobante(true);
        toast.success("Extracción realizada con éxito");
        if (!caja || !cajero) return;
        generatePDF({
          cajero: cajero.nombre,
          caja: caja.numero,
          dateTime: getCurrentDate(),
          monto: Number(cantidad),
          observaciones: observaciones,
        });

        setCantidad(0);
        setObservaciones("");
        setUsuario("");
        setContrasena("");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      }
      setMostrarComprobante(false);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-800 h-[80vh] rounded-md">
      <form
        className="p-8 bg-gray-700 rounded-md shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-white">
          Solicitud de Extracción de Efectivo
        </h2>
        <div className=" flex items-center gap-3 justify-center mb-4">
          <div className="">
            <label
              className="mb-3 mt-5 block text-primary-200"
              htmlFor="username"
            >
              Nombre de usuario
            </label>
            <div className="relative">
              <input
                className="w-full bg-gray-900 rounded-lg py-[9px] pl-10"
                id="username"
                type="text"
                name="username"
                value={usuario}
                onChange={handleUsuarioChange}
                placeholder="Ingrese su nombre"
                autoComplete="name"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300" />
            </div>
          </div>
          <PasswordField
            className="bg-gray-900"
            label="Contraseña"
            name="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={handleContrasenaChange}
            validate={false}
          />
        </div>
        <div className="my-4">
          <label className="block text-primary-200 mb-2">
            Cantidad a extraer:
          </label>
          <Input
            id="cantidad"
            type="formattedNumber"
            value={cantidad}
            placeholder="Ingrese el monto a extraer"
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="text-white py-2 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="">
          <label className="block text-primary-200 mb-2">Observacioes:</label>
          <Input
            type="text"
            id="observaciones"
            placeholder="Observaciones..."
            value={observaciones}
            onChange={handleObservacionesChange}
            className="text-white py-2 px-4 bg-gray-900 mt-1 mb-5 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className={
              "px-4 py-2 bg-primary-800 text-white rounded-md w-full hover:bg-primary-700" +
              (loading ? " cursor-not-allowed" : "")
            }
          >
            {loading ? "Procesando..." : "Solicitar Extracción"}
          </button>
        </div>
        <Toaster richColors />
      </form>
    </div>
  );
};

export default Extraccion;

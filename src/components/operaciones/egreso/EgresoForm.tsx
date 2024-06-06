"use client";
import React, { useState } from "react";
import { login } from "@/lib/auth/login";
import crearMovimiento from "@/lib/moduloCaja/movimiento/crearMovimiento";
import { AperturaCaja } from "@prisma/client";
import { obtenerCookie } from "@/lib/obtenerCookie";
import ComprobanteEgreso, { generatePDF } from "@/components/PDF/ComprobanteEgreso";
import { Caja } from "@prisma/client";
import { Cajero } from "@/lib/definitions";
import { getCurrentDate } from "@/lib/getCurrentDate";

const caja: Caja = obtenerCookie("caja");
const cajero: Cajero = obtenerCookie("cajero");

const Extraccion: React.FC = () => {
  const [cantidad, setCantidad] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [mostrarComprobante, setMostrarComprobante] = useState(false);
  const [error, setError] = useState("");
  const apertura: AperturaCaja = obtenerCookie("apertura");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); 
    await autenticarJefeDeCajas();
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario(e.target.value);
  };

  const handleContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContrasena(e.target.value);
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(e.target.value);
  };

  const handleObservacionesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObservaciones(e.target.value);
  };

  const autenticarJefeDeCajas = async () => {
    try {
      const error = await login({ username: usuario, password: contrasena });
      if (!error) {
        setAutenticado(true);
        setError("");
        alert("Autenticacion correcta");
        await solicitarExtraccion();
        
      } else {
        setAutenticado(false);
        alert("Autenticacion incorrecta");
        setError("Usuario no autorizado para la extracción");
      }
    } catch (err) {
      setError("Error en la autenticación.");
    }
  };

  const solicitarExtraccion = async () => {
    try {
      const result = await crearMovimiento({
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

      if (typeof result === "string") {
        setError(result);
        setMostrarComprobante(false);
      } else {
        setMostrarComprobante(true);
        generatePDF({
          cajero: cajero.nombre,
          caja: caja.numero,
          dateTime: getCurrentDate(),
          monto: Number(cantidad),
        });

        setCantidad("");
        setObservaciones("");
        setUsuario("");
        setContrasena("");
      }
    } catch (err) {
      setError("Error en la solicitud de extracción.");
      setMostrarComprobante(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-800 pt-20">
      <form className="p-8 bg-gray-700 rounded-md shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-white">Solicitud de Extracción de Efectivo</h2>
        <div className="mb-4">
          <label className="block text-white">Cantidad a extraer:</label>
          <input
            type="number"
            value={cantidad}
            onChange={handleCantidadChange}
            className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Observaciones:</label>
          <input
            type="text"
            value={observaciones}
            onChange={handleObservacionesChange}
            className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div>
            <label className="block text-white">Usuario:</label>
            <input
              type="text"
              value={usuario}
              onChange={handleUsuarioChange}
              className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese su usuario"
              required
            />
          </div>
          <div className="mb-4 flex gap-4">
            <div>
              <label className="block text-white">Contraseña:</label>
              <input
                type="password"
                value={contrasena}
                onChange={handleContrasenaChange}
                className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <button type="submit" className="px-4 py-2 bg-primary-800 text-white rounded w-full">
            Solicitar Extracción
          </button>
        </div>
        {error && (
          <div className="text-red-500 mt-4">
            <p>{error}</p>
          </div>
        )}
        {mostrarComprobante && (
          <div className="text-green-500 mt-4">
            <p>Comprobante generado y descargado</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Extraccion;

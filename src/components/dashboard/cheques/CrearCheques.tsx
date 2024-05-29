"use client";
import React, { useState, useEffect } from "react";
import agregarCheque from "@/lib/moduloBanco/cheque/agregarCheque";
import obtenerBancos from "@/lib/moduloBanco/banco/obtenerBancos";
import { Banco } from "@prisma/client";
import obtenerCuentaBancaria from "@/lib/moduloBanco/cuentaBancaria/obtenerCuentaBancaria";
import { CuentaBancariaAndBanco } from "@/lib/definitions";
import { Toaster, toast } from "sonner";
import { useCalendar } from "@/lib/hooks/useCalendar";
import InputCalendar from "@/components/global/InputCalendar";
import Input from "@/components/global/Input";

const CrearCheques = () => {
  const estadoInicial = [{ id: "0", nombre: "No hay bancos", deleted: null }];

  // Definir estados para almacenar los valores del cheque
  const [numeroCheque, setNumeroCheque] = useState("");
  const [esRecibido, setEsRecibido] = useState(false);
  const [monto, setMonto] = useState(0);
  const [fechaEmision, setFechaEmision] = useState("");

  const [involucrado, setInvolucrado] = useState("");
  const [bancoChequeId, setBancoChequeId] = useState("");
  console.log(bancoChequeId);
  const [cuentaBancariaAfectadaId, setCuentaBancariaAfectadaId] = useState("");
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [cuentasBancarias, setCuentasBancarias] = useState<
    CuentaBancariaAndBanco[]
  >([]);

  const { maxDate } = useCalendar();

  const obtenerYMostrarBanco = async () => {
    try {
      const cuentasData = await obtenerBancos();

      if (cuentasData === undefined || typeof cuentasData === "string") return;

      setBancos(cuentasData.data ?? estadoInicial);
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  };

  const obtenerYMostrarCuentasBancarias = async () => {
    try {
      const cuentasData = await obtenerCuentaBancaria();

      if (cuentasData === undefined || typeof cuentasData === "string") return;

      setCuentasBancarias(cuentasData.data ?? estadoInicial);
    } catch (error) {
      console.error("Error al obtener los tipos de operacion:", error);
    }
  };
  // const [banco, setBanco] = useState<Banco[]>(estadoInicial);

  useEffect(() => {
    obtenerYMostrarBanco();
    obtenerYMostrarCuentasBancarias();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const r = await agregarCheque(
        numeroCheque,
        esRecibido,
        monto,
        new Date(fechaEmision),
        involucrado,
        bancoChequeId,
        cuentaBancariaAfectadaId
      );
      if (r !== undefined && typeof r !== "string") {
        if (r.success) {
          toast.success("Cheque registrado exitosamente");
          // Limpiar los campos después de registrar el cheque
          resetInputs();
        } else {
          toast.error(r.error || "Error al registrar el cheque");
        }
      }
    } catch (error) {
      // Manejar el error si la función agregarCheque falla
      console.error("Error al registrar el cheque:", error);
    }
  };

  const resetInputs = () => {
    setNumeroCheque("");
    setEsRecibido(false);
    setMonto(0);
    setFechaEmision("");
    setInvolucrado("");
    setBancoChequeId("");
    setCuentaBancariaAfectadaId("");
  };

  const handleSetCuentaBancariaAfectadaId = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!esRecibido) {
      setBancoChequeId(
        cuentasBancarias.filter((c) => c.id === event.target.value)[0].bancoId
      );
    }
    setCuentaBancariaAfectadaId(event.target.value);
  };

  const handleSetEsRecibido = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setEsRecibido(value);
    if (!value) {
      if (cuentaBancariaAfectadaId !== "") {
        setBancoChequeId(
          cuentasBancarias.filter((c) => c.id === cuentaBancariaAfectadaId)[0]
            .bancoId
        );
      }
    }
  };

  return (
    <div className=" mx-auto bg-gray-800 py-6 px-4 rounded-md shadow-md [min-width:300px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="numeroCheque" className="block font-medium">
              Número de Cheque:
            </label>
            <input
              type="text"
              id="numeroCheque"
              required
              value={numeroCheque}
              onChange={(e) => setNumeroCheque(e.target.value)}
              className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="monto" className="block font-medium">
              Monto:
            </label>
            <Input
              type="number"
              required
              id="monto"
              placeholder=""
              value={`${monto === 0 ? "" : monto}`}
              onChange={(e) => setMonto(Number(e.target.value))}
              className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <input
            type="checkbox"
            id="esRecibido"
            checked={esRecibido}
            onChange={handleSetEsRecibido}
            className="text-blue-500 border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <label htmlFor="esRecibido" className="ml-2">
            Es recibido
          </label>
        </div>
        <div>
          <label htmlFor="fechaEmision" className="block font-medium">
            Fecha de Emisión:
          </label>
          <InputCalendar
            id="fechaEmision"
            required
            value={fechaEmision}
            setValue={setFechaEmision}
            className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="involucradoNombre" className="block font-medium">
            {esRecibido ? "Librador" : "Acreedor"}
          </label>
          <input
            type="text"
            id="involucradoNombre"
            required
            value={involucrado}
            onChange={(e) => setInvolucrado(e.target.value)}
            className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="bancoChequeId" className="block font-medium">
              Banco del cheque:
            </label>
            <select
              id="bancoChequeId"
              value={bancoChequeId}
              required
              disabled={!esRecibido}
              onChange={(e) => setBancoChequeId(e.target.value)}
              className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-700 disabled:opacity-50"
            >
              <option value="">Selecciona un banco</option>
              {bancos.map((banco) => (
                <option key={banco.id} value={banco.id}>
                  {banco.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="cuentaBancariaId" className="block font-medium">
              Cuenta bancaria Afectada:
            </label>
            <select
              id="cuentaBancariaId"
              value={cuentaBancariaAfectadaId}
              onChange={handleSetCuentaBancariaAfectadaId}
              className="text-white py-1 px-4 bg-gray-900 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una cuenta</option>
              {cuentasBancarias.map((cuentasBancarias) => (
                <option key={cuentasBancarias.id} value={cuentasBancarias.id}>
                  {cuentasBancarias.banco.nombre}{" "}
                  {cuentasBancarias.numeroCuenta}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className=" bg-primary-800 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 "
          >
            Registrar Cheque
          </button>
        </div>
      </form>
      <Toaster richColors />
    </div>
  );
};

export default CrearCheques;

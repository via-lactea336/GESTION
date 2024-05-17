"use client";
import obtenerBancos from "@/lib/banco/obtenerBancos";
import obtenerCuentaBancaria from "@/lib/cuentaBancaria/obtenerCuentaBancaria";
import { CuentaBancariaAndBanco } from "@/lib/definitions";
import { useCalendar } from "@/lib/hooks/useCalendar";
import agregarOperacion from "@/lib/operacion/agregarOperacion";
import obtenerTiposOperacion from "@/lib/tipoOperacion/obtenerTiposOperacion";
import { Banco, TipoOperacion } from "@prisma/client";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

type Operacion = {
  tipoOperacionId: string;
  fechaOperacion: Date;
  monto: number;
  cuentaBancariaOrigenId: string;
  bancoInvolucrado: string;
  nombreInvolucrado: string;
  cuentaInvolucrado: string;
  rucInvolucrado: string;
  concepto: string;
  numeroComprobante: string;
};

export default function FormTransferencias() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data: Operacion = {
      tipoOperacionId: form["operacion"].value,
      fechaOperacion: new Date(form["fechaOperacion"].value),
      monto: Number(form["monto"].value),
      cuentaBancariaOrigenId: form["cuentaBancariaOrigenId"].value,
      bancoInvolucrado: form["bancoInvolucrado"].value,
      nombreInvolucrado: form["nombreInvolucrado"].value,
      cuentaInvolucrado: form["cuentaInvolucrado"].value,
      rucInvolucrado: form["rucInvolucrado"].value,
      concepto: form["concepto"].value,
      numeroComprobante: form["comprobante"].value,
    };
    const response = await agregarOperacion(
      data.tipoOperacionId,
      data.fechaOperacion,
      data.monto,
      data.cuentaBancariaOrigenId,
      data.bancoInvolucrado,
      data.nombreInvolucrado,
      data.cuentaInvolucrado,
      data.rucInvolucrado,
      data.concepto,
      data.numeroComprobante
    );
    if (response !== undefined && typeof response !== "string") {
      if (response.error) {
        toast.error("Error al registrar la operación");
      } else {
        toast.success("Operación registrada correctamente");
        // Limpiar formulario
        form.reset();
      }
    }
  };
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [esDebito, setEsDebito] = useState<boolean>(false);
  const [cuentasBancarias, setCuentasBancarias] = useState<
    CuentaBancariaAndBanco[]
  >([]);
  const [operaciones, setOperaciones] = useState<TipoOperacion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDatos = async () => {
    setLoading(true);
    const bancos = await obtenerBancos();
    const cuentasBancarias = await obtenerCuentaBancaria();
    const operaciones = await obtenerTiposOperacion();
    if (
      bancos !== undefined &&
      cuentasBancarias !== undefined &&
      operaciones !== undefined &&
      typeof bancos !== "string" &&
      typeof cuentasBancarias !== "string" &&
      typeof operaciones !== "string"
    ) {
      setBancos(bancos.data);
      setCuentasBancarias(cuentasBancarias.data);
      setOperaciones(operaciones.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const { maxDate } = useCalendar();

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">Tipo de Transacción</label>
          <div className="relative mt-2">
            <select
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id="operacion"
              required
              onChange={(e) => {
                setEsDebito(
                  operaciones.find((op) => op.id === e.target.value)
                    ?.esDebito || false
                );
              }}
            >
              {loading ? (
                <option>Cargando...</option>
              ) : (
                operaciones.map((operacion) => (
                  <option key={operacion.id} value={operacion.id}>
                    {operacion.nombre}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">
            Cuenta del {!esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <div className="relative mt-2">
            <select
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id="cuentaBancariaOrigenId"
              required
            >
              {loading ? (
                <option>Cargando...</option>
              ) : (
                cuentasBancarias.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.banco.nombre.split("Banco")} {cuenta.numeroCuenta}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">
            Banco del {esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <div className="relative mt-2">
            <select
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id="bancoInvolucrado"
              required
            >
              {loading ? (
                <option>Cargando...</option>
              ) : (
                bancos.map((banco) => (
                  <option key={banco.id}>{banco.nombre}</option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">
            Cuenta del {esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            id="cuentaInvolucrado"
            required
            type="text"
            placeholder="22-187805"
          />
        </div>
      </div>

      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className=" mb-2">
            Nombre del {esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            id="nombreInvolucrado"
            type="text"
            required
            placeholder="Pedro Meza"
          />
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">Ruc</label>
          <input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            id="rucInvolucrado"
            type="text"
            required
            placeholder="123456-1"
          />
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className=" mb-2">Monto</label>
          <input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            id="monto"
            type="number"
            required
            placeholder="150000"
            min={1}
          />
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">Número de Comprobante</label>
          <input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            id="comprobante"
            type="text"
            required
            placeholder="012345"
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="mb-2">Fecha de la Transacción</label>
          <input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="fechaOperacion"
            type="date"
            required
            placeholder="012345"
            max={maxDate}
          />
        </div>
        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <label className="mb-2">Concepto</label>
          <input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            id="concepto"
            type="text"
            required
            placeholder="Pago de servicios básicos"
          />
        </div>
      </div>
      <div className="px-3 flex items-center justify-end mb-6 md:mb-0">
        <button
          type="submit"
          className="bg-primary-800 mt-4 rounded-md px-3 py-3  hover:bg-primary-700 cursor-pointer"
        >
          Registrar Operación
        </button>
      </div>
      <Toaster richColors />
    </form>
  );
}

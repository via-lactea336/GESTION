import Input from "@/components/global/Input";
import InputCalendar from "@/components/global/InputCalendar";
import { CrearOperacionFields } from "@/lib/moduloBanco/operacion/agregarOperacion";
import { Banco } from "@prisma/client";
import React from "react";

type Props = {
  monto: number;
  operacion: CrearOperacionFields;
  setMontoParcial: (value: number) => void;
  handleOnChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  bancos: Banco[];
  loading: boolean;
  esDebito: boolean;
  pagoProveedores: boolean;
};

export default function Transferencia({
  operacion,
  handleOnChange,
  setMontoParcial,
  monto,
  bancos,
  esDebito,
  pagoProveedores,
}: Props) {
  return (
    <>
      <div className="flex sm:flex-row flex-wrap flex-col box-border gap-3 mb-3 w-full">
        <div className="flex flex-col w-full">
          <label className=" mb-2">
            Nombre del {esDebito ? "Destinatario" : "Remitente"}*
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="nombreInvolucrado"
            onChange={handleOnChange}
            type="text"
            value={operacion.nombreInvolucrado || ""}
            required
            placeholder="Ingrese el nombre"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className=" mb-2">
            Banco del {esDebito ? "Destinatario" : "Remitente"}*
          </label>
          <select
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="bancoInvolucrado"
            onChange={handleOnChange}
            value={operacion.bancoInvolucrado || ""}
            required
          >
            <option value={""}>Seleccione un banco</option>
            {bancos.map((banco) => (
              <option key={banco.id} value={banco.nombre}>
                {banco.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full">
          <label className="mb-2">
            N° de documento del {esDebito ? "Destinatario" : "Remitente"}*
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="rucInvolucrado"
            onChange={handleOnChange}
            required={true}
            value={operacion.rucInvolucrado || ""}
            type="text"
            placeholder="Ingrese el RUC"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className=" mb-2">
            N° de Cuenta del {esDebito ? "Destinatario" : "Remitente"}*
          </label>
          <Input
            className={
              "block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            }
            onChange={handleOnChange}
            id="cuentaInvolucrado"
            value={operacion.cuentaInvolucrado || ""}
            type="text"
            required
            placeholder="Ingrese el numero de cuenta"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className=" mb-2">Monto*</label>
          <Input
            className={
              "block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            }
            onChange={(e) => setMontoParcial(Number(e.target.value))}
            id="montoParcial"
            value={monto}
            type="formattedNumber"
            required
            placeholder="Ingrese el monto"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="mb-2">Número de Comprobante*</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="numeroComprobante"
            type="text"
            onChange={handleOnChange}
            value={operacion.numeroComprobante}
            required
            placeholder="Ingrese el numero de comprobante"
          />
        </div>
      </div>

      <div className="flex w-full gap-3">
        <div className="w-full md:  mb-6 md:mb-0">
          <label className="mb-2">Fecha de la Transacción*</label>
          <InputCalendar
            withTime={true}
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="fechaOperacion"
            handleChange={handleOnChange}
            value={operacion.fechaOperacion}
            required
          />
        </div>
        <div className="w-full md:w-2/3 mb-6 md:mb-0">
          <label className="mb-2">Concepto*</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 disabled:opacity-50 px-6 my-2 leading-tight focus:outline-none"
            id="concepto"
            type="text"
            disabled={pagoProveedores}
            onChange={handleOnChange}
            value={operacion.concepto}
            required
            placeholder="Ingrese el concepto"
          />
        </div>
      </div>
    </>
  );
}

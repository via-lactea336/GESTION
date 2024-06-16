import Input from '@/components/global/Input'
import InputCalendar from '@/components/global/InputCalendar'
import React, { useEffect, useState } from 'react'
import { ChequeCreate } from './AgregarCheque'
import { CuentaBancariaAndBanco } from '@/lib/definitions'
import { CrearOperacionFields } from '@/lib/moduloBanco/operacion/agregarOperacion'

type Props = {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  cheques: ChequeCreate[]
  setCheques: React.Dispatch<React.SetStateAction<ChequeCreate[]>>
  operacion: CrearOperacionFields
}

export default function EmitirCheque({
  handleOnChange,
  setCheques,
  operacion,
  cheques
}: Props) {

  console.log(cheques)

  return (
    <>
      <div className="flex sm:flex-row flex-wrap flex-col box-border gap-3 mb-3 w-full">

        <div className="flex flex-col w-full">
          <label className=" mb-2">
            Nombre del Acreedor
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="nombreInvolucrado"
            onChange={
              (e) => {
                handleOnChange(e)
                setCheques(prev => [{ ...prev[prev.length - 1], involucrado: e.target.value }])
              }
            }
            type="text"
            value={operacion.nombreInvolucrado || ""}
            required
            placeholder="Ingrese el nombre"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="mb-2">Ruc del Acreedor</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="rucInvolucrado"
            onChange={handleOnChange}
            value={operacion.rucInvolucrado || ""}
            type="text"
            placeholder="Ingrese el RUC"
          />
        </div>
        
        <div className="flex flex-col w-full">
          <label className=" mb-2">N° de Cheque</label>
          <Input
            className={'block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none'}
            onChange={(e) => setCheques(prev => [{ ...prev[0], numeroCheque: e.target.value }])}
            id="cuentaInvolucrado"
            value={cheques.length !== 0 ? cheques[0].numeroCheque : ""}
            type="text"
            required
            placeholder="Ingrese el numero de cheque"
          />
        </div>
        
        <div className="flex flex-col w-full">
          <label className=" mb-2">Monto*</label>
          <Input
            className={'block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none'}
            onChange={(e) => {
              handleOnChange(e)
              setCheques(prev => [{ ...prev[0], monto: Number(e.target.value) }])
            }}
            id="monto"
            value={operacion.monto}
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
            handleChange={(e) => {
              handleOnChange(e)
              setCheques(prev => [{ ...prev[0], fechaEmision: e.target.value }])
            }}
            value={operacion.fechaOperacion}
            required
          />
        </div>
        <div className="w-full md:w-2/3 mb-6 md:mb-0">
          <label className="mb-2">Concepto*</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="concepto"
            type="text"
            onChange={handleOnChange}
            value={operacion.concepto}
            required
            placeholder="Ingrese el concepto"
          />
        </div>

      </div>
    </>
  )
}
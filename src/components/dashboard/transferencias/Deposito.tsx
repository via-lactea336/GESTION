import Input from '@/components/global/Input'
import InputCalendar from '@/components/global/InputCalendar'
import React from 'react'
import AgregarCheque, { ChequeCreate } from './AgregarCheque'
import { Banco } from '@prisma/client'
import { CrearOperacionFields } from '@/lib/moduloBanco/operacion/agregarOperacion'

type Props = {
  loading: boolean
  operacion: CrearOperacionFields
  setOperacion: React.Dispatch<React.SetStateAction<CrearOperacionFields>>
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void
  setMontoParcial: React.Dispatch<React.SetStateAction<number>>
  bancos: Banco[]
  montoParcial: number,
  cheques: ChequeCreate[]
  setCheques: React.Dispatch<React.SetStateAction<ChequeCreate[]>>
}

export default function Deposito({operacion, setOperacion, handleOnChange, loading, setMontoParcial, montoParcial, bancos, cheques, setCheques}: Props) {
  return (
    <>
      <div className="flex sm:flex-row flex-wrap flex-col box-border gap-3 mb-3 w-full">

        <div className="flex flex-col w-full">
          <label className=" mb-2">
            Nombre del depositante
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
          <label className="mb-2">Ruc</label>
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
          <label className=" mb-2">Monto (Efectivo)</label>
          <Input
            className={'block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none'}
            id="montoParcial"
            onChange={(e) => setMontoParcial(Number(e.target.value))} 
            value={montoParcial}
            type="formattedNumber"
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

        <AgregarCheque 
          cheques={cheques}
          chequeRecibido={true}
          setCheques={setCheques}
          handleOnChangeOperacion={handleOnChange}
          loading={loading}
          operacion={operacion}
          setOperacion={setOperacion}
          monto={operacion.monto}
          bancos={bancos}
        />
  </>
  )
}
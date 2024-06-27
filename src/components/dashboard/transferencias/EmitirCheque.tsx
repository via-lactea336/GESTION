import Input from '@/components/global/Input'
import InputCalendar from '@/components/global/InputCalendar'
import React, {useState} from 'react'
import { ChequeCreate } from './AgregarCheque'
import { CrearOperacionFields } from '@/lib/moduloBanco/operacion/agregarOperacion'

type Props = {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  cheques: ChequeCreate[]
  setCheques: React.Dispatch<React.SetStateAction<ChequeCreate[]>>
  operacion: CrearOperacionFields
  pagoProveedores: boolean
}

export default function EmitirCheque({
  handleOnChange,
  setCheques,
  operacion,
  cheques,
  pagoProveedores
}: Props) {

  const [esDiferido, setEsDiferido] = useState(false)

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
            value={cheques[0]?.monto || ""}
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

        <div className="flex gap-2 items-center">
          <input type="checkbox"
            checked={esDiferido}
            onChange={(e) => {
              setEsDiferido(e.target.checked)
              if (!e.target.checked) setCheques(prev => [{ ...prev[0], fechaPago: undefined }])
            }}
            id="esDiferido" />
          <label htmlFor='esDiferido'>Fecha de Pago</label>
          <InputCalendar
            value={cheques[0]?.fechaPago || ""}
            disabled={!esDiferido}
            limit={
              operacion.fechaOperacion.trim() === "" ? undefined :
              new Date(operacion.fechaOperacion)
            }
            handleChange={(e) => {
              setCheques(prev => [{ ...prev[0], fechaPago: e.target.value }])
            }}
            id='fechaPago'
            className='disabled:opacity-50 flex-1 block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none'
          />
        </div>

      </div>

      <div className="flex gap-2 items-center w-full">
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
            className="block w-full bg-gray-800 rounded disabled:opacity-50 py-3 px-6 my-2 leading-tight focus:outline-none"
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
  )
}
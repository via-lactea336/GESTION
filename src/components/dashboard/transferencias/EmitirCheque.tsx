import Input from '@/components/global/Input'
import InputCalendar from '@/components/global/InputCalendar'
import React, { useEffect, useState } from 'react'
import { ChequeCreate } from './AgregarCheque'
import { Banco } from '@prisma/client'
import { CuentaBancariaAndBanco } from '@/lib/definitions'
import { CrearOperacionFields } from '@/lib/moduloBanco/operacion/agregarOperacion'

type Props = {
  setOperacion: React.Dispatch<React.SetStateAction<CrearOperacionFields>>
  handleOnChangeOperacion : (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void
  cheques: ChequeCreate[]
  setCheques: React.Dispatch<React.SetStateAction<ChequeCreate[]>>
  cuentasBancarias: CuentaBancariaAndBanco[]
}

export default function EmitirCheque({
  cuentasBancarias,
  handleOnChangeOperacion,
  setOperacion,
  setCheques
}: Props) {

  const [cheque, setCheque] = useState<ChequeCreate>({
    numeroCheque: '',
    involucrado: '',
    monto: 0,
    fechaEmision: '',
    esRecibido: false,
    bancoChequeId: '',
  })
  
  const onChangeHanlder = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheque(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  useEffect(() => {
    // setOperacion(prev => ({ ...prev, ["bancoChequeId"]: cheque.bancoChequeId }))
    setCheques(prev => {
      const prevList = [...prev]
      prevList[0] = (cheque)
      return prevList
    })
  }, [cheque])  

  return (
    <>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">
            Cuenta Afectada
          </label>
          <div className="relative mt-2">
            <select
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              onChange={(e) => {
                handleOnChangeOperacion(e)
                setCheque(prev => ({ ...prev, ["bancoChequeId"]: cuentasBancarias.find(c => c.id === e.target.value)?.bancoId || "" }))
              }}
              id="cuentaBancariaOrigenId"
              required
            >
              
              {cuentasBancarias.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.banco.nombre.split("Banco")} {cuenta.numeroCuenta}
                  </option>
                ))
              }
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
      </div>

      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className=" mb-2">
            Nombre del Acreedor
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="nombreInvolucrado"
            onChange={ (e) =>{ 
              handleOnChangeOperacion(e)
              onChangeHanlder(e)
            }}
            type="text"
            required
            placeholder="Pedro Meza"
          />
        </div>

        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className=" mb-2">
            Num. Cheque
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="numeroCheque"
            onChange={ (e) =>{ 
              handleOnChangeOperacion(e)
              onChangeHanlder(e)
            }}
            type="text"
            required
            placeholder="Pedro Meza"
          />
        </div>

        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className=" mb-2">Monto</label>
          <Input
            className={'block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none'}
            id="monto"
            onChange={(e) => {
              handleOnChangeOperacion(e)
              onChangeHanlder(e)
            }}
            type="number"
            required
            placeholder="150000"
          />
        </div>

        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">Número de Comprobante</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="numeroComprobante"
            type="text"
            onChange={handleOnChangeOperacion}
            required
            placeholder="012345"
          />
        </div>

      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="mb-2">Fecha de la Transacción</label>
          <InputCalendar
            withTime={true}
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="fechaOperacion"
            handleChange={
              (e) => {
                handleOnChangeOperacion(e)
                setCheque(prev => ({ ...prev, ["fechaEmision"]: new Date (e.target.value).toISOString() }))
              }
            }
            required
          />
        </div>
        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <label className="mb-2">Concepto</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="concepto"
            type="text"
            onChange={handleOnChangeOperacion}
            required
            placeholder="Pago de servicios básicos"
          />
        </div>
      </div>
    </>
  )
}
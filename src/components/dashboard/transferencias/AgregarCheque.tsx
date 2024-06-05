"use client"

import Input from '@/components/global/Input'
import { Banco } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import InputCalendar from '@/components/global/InputCalendar'
import { CuentaBancariaAndBanco } from '@/lib/definitions'

export type ChequeCreate = {
  numeroCheque: string,
  involucrado: string,
  monto: number,
  fechaEmision: string,
  esRecibido: true,
  bancoChequeId: string,
}

type Props = {
  cheques: ChequeCreate[]
  setCheques: React.Dispatch<React.SetStateAction<ChequeCreate[]>>
  bancos: Banco[]
  cuentasBancarias: CuentaBancariaAndBanco[]
}

export default function AgregarCheque({
  cheques,
  setCheques,
  bancos,
  cuentasBancarias
}: Props) {

  const [display, setDisplay] = useState(false)
  const [cheque, setCheque] = useState<ChequeCreate>({
    numeroCheque: '',
    involucrado: '',
    monto: 0,
    fechaEmision: '',
    esRecibido: true,
    bancoChequeId: '',
  })

  const [montos, setMontos] = useState({
    efectivo:0, 
    montoCheque:0, 
    monto:0
  })


  useEffect(() => {
    setMontos(prev => ({ ...prev, monto: prev.efectivo + prev.montoCheque }))
  }, [montos.efectivo, montos.montoCheque])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setCheque(prev => {
      if (name === "montoCheque") return { ...prev, ["monto"]: Number(value) }
      return { ...prev, [name]: value }
    })
  }

  const onChangeMontos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMontos(prev => ({ ...prev, [name]: Number(value) }))
  }

  const handleAddChequeToList = (chequeDatos: ChequeCreate) => {
    if (cheques.find(c => c.numeroCheque === chequeDatos.numeroCheque)) return
    setCheques(prev => [...prev, chequeDatos])
    setMontos(prev => ({ ...prev, montoCheque: [...cheques, chequeDatos].reduce((init, curr) => init + curr.monto, 0) }))
  }

  return (

    <>
    <div className="grid grid-rows-2 grid-flow-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="w-full px-3 mb-6 md:mb-0">
          <label className="mb-2">
            Cuenta del Beneficiario
          </label>
          <div className="relative mt-2">
            <select
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id="cuentaBancariaOrigenId"
              required
            >
              {(
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

          <div className="w-full px-3 mb-6 md:mb-0">
            <label className=" mb-2">
              Nombre del Remitente
            </label>
            <Input
              className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
              id="nombreInvolucrado"
              type="text"
              required
              placeholder="Pedro Meza"
            />
          </div>

        <div className="w-full px-3 mb-6 md:mb-0">
            <label className=" mb-2">Efectivo</label>
            <Input
              className={block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none}
              onChange={onChangeMontos}
              id="efectivo"
              type="number"
              required
              placeholder="150000"
            />
          </div>
          
        <div className="w-full px-3 mb-6 md:mb-0">
            <label className="mb-2">Número de Comprobante</label>
            <Input
              className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
              id="comprobante"
              type="text"
              required
              placeholder="012345"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="w-full px-3 mb-6 md:mb-0">
            <label className="mb-2">Fecha de la Transacción</label>
            <InputCalendar
              className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
              id="fechaOperacion"
              required
            />
        </div>
        <div className="px-3 mb-6 col-span-2 md:mb-0">
            <label className="mb-2">Concepto</label>
            <Input
              className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
              id="concepto"
              type="text"
              required
              placeholder="Pago de servicios básicos"
            />
        </div>
        <div className="w-full px-3 mb-6 md:mb-0">
            <label className="mb-2">Monto Total</label>
            <input 
              value={montos.monto} 
              id="monto" disabled={true} 
              className=" w-full bg-gray-800 opacity-50 cursor-not-allowed rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            />
        </div>
      </div>
    </div>
      

      <div className="w-full flex flex-col mt-8">
        <div className="flex w-full items-center gap-4 mb-8">
          <p>Cheques</p>
          <hr className="flex-1"></hr>
          <button
            className="bg-primary-500 hover:bg-primary-600 text-white w-6 h-6 rounded-full"
            onClick={() => setDisplay(prev => !prev)}
          >
            <ChevronDownIcon />
          </button>
        </div>
      </div>
      {display &&
        <div className="w-full flex gap-4">
          <table className="w-full border-collapse table-auto h-full ">
            <thead>
              <tr className="w-full border-b-4 border-gray-600 text-left">
                <th>N° Cheque</th>
                <th>Monto</th>
                <th>Librador</th>
              </tr>
            </thead>
            <tbody className='overflow-y-auto'>
              {cheques?.map((cheque) => (
                <tr className='h-12' key={cheque.numeroCheque}>
                  <td>{cheque.numeroCheque}</td>
                  <td>{cheque.monto}</td>
                  <td>{cheque.involucrado}</td>
                  <td>
                    <button
                      type='button'
                      className='bg-red-500 hover:bg-red-600 text-white p-1 rounded'
                      onClick={() => setCheques(prev => prev.filter(c => c !== cheque))}
                    >
                      <TrashIcon className='w-6' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 border-2 border-gray-500 rounded">
            <h2 className="text-xl font-bold my-4">Agregar cheque</h2>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <label>Banco</label>
                <select
                  className='bg-gray-800 text-white py-1 px-2 rounded-md '
                  onChange={onChange}
                >
                  <option>Selecciona el banco del cheque</option>
                  {
                    bancos.map(banco => <option key={banco.id} value={banco.id}>{banco.nombre}</option>)
                  }
                </select>
              </div>
              <div className="flex gap-2">
                <label>Monto</label>
                <Input
                  onChange={onChange}
                  placeholder='Ingrese el monto del cheque'
                  id='montoCheque'
                  type='number'
                  className='bg-gray-800 text-white py-1 px-2 rounded-md'
                />
              </div>
              <div className="flex gap-2">
                <label>Librador</label>
                <Input
                  onChange={onChange}
                  value={cheque.involucrado}
                  placeholder='Banco del cheque...'
                  id='involucrado'
                  type='text'
                  className='bg-gray-800 text-white py-1 px-2 rounded-md flex-1'
                />
              </div>
              <div className="flex gap-2">
                <label>Emision</label>
                <InputCalendar
                  value={cheque.fechaEmision}
                  handleChange={onChange}
                  id='fechaEmision'
                  className='bg-gray-800 text-white py-1 px-2 rounded-md'
                />
              </div>
              <div className="flex gap-2">
                <label>N° Cheque</label>
                <Input
                  value={cheque.numeroCheque}
                  onChange={onChange}
                  placeholder='12345678-A132-098'
                  id='numeroCheque'
                  type='text'
                  className='bg-gray-800 text-white py-1 px-2 rounded-md'
                />
              </div>
              <button
                className="bg-primary-500 hover:bg-primary-600 text-white p-1 rounded"
                type='button'
                onClick={() => handleAddChequeToList(cheque)}
              >Agregar
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}
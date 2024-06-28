  "use client"

  import Input from '@/components/global/Input'
  import { Banco } from '@prisma/client'
  import React, { useEffect, useState } from 'react'
  import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'
  import InputCalendar from '@/components/global/InputCalendar'
  import { CuentaBancariaAndBanco } from '@/lib/definitions'
  import { CrearOperacionFields } from '@/lib/moduloBanco/operacion/agregarOperacion'

  export type ChequeCreate = {
    numeroCheque: string,
    involucrado: string,
    monto: number,
    fechaEmision: string,
    esRecibido: boolean,
    bancoChequeId: string,
    fechaPago?: string
  }

  type Props = {
    monto:number
    operacion: CrearOperacionFields
    setOperacion: React.Dispatch<React.SetStateAction<CrearOperacionFields>>
    handleOnChangeOperacion : (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void
    cheques: ChequeCreate[]
    setCheques: React.Dispatch<React.SetStateAction<ChequeCreate[]>>
    bancos: Banco[]
    loading: boolean
    chequeRecibido:boolean
  }

  export default function AgregarCheque({
    cheques,
    setCheques,
    bancos,
    setOperacion,
    operacion,
    loading,
    monto,
    chequeRecibido
  }: Props) {

    const [display, setDisplay] = useState(false)

    const initValueCheque = {
      numeroCheque: '',
      involucrado: '',
      monto: 0,
      fechaEmision: '',
      esRecibido: chequeRecibido,
      bancoChequeId: '',
    }
    const [cheque, setCheque] = useState<ChequeCreate>(initValueCheque)

    const initMontosValues = {
      efectivo:0, 
      montoCheque:0, 
      monto:0
    }
    const [montos, setMontos] = useState(initMontosValues)

    const [esDiferido, setEsDiferido] = useState(false)

    useEffect(() => {
      setMontos(initMontosValues)
      setCheque(initValueCheque)
    }, [loading])

    useEffect(() => {
      setMontos(prev => ({ ...prev, monto: prev.efectivo + prev.montoCheque }))
      setOperacion(prev => ({ ...prev, ["monto"]: montos.efectivo + montos.montoCheque  }))
    }, [montos.efectivo, montos.montoCheque])

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, id } = e.target
      setCheque(prev => {
        return { ...prev, [name || id]: value }
      })
    }

    const handleAddChequeToList = (chequeDatos: ChequeCreate) => {
      if (cheques.find(c => c.numeroCheque === chequeDatos.numeroCheque)) return
      if (
        cheque.monto === 0 || 
        cheque.involucrado === '' || 
        cheque.bancoChequeId === '' || 
        cheque.fechaEmision === '' ||
        cheque.bancoChequeId === ''
      ) return
      setCheques(prev => [...prev, {...chequeDatos, fechaEmision: new Date(chequeDatos.fechaEmision).toISOString()}])
      setMontos(prev => ({ ...prev, montoCheque: [...cheques, chequeDatos].reduce((init, curr) => init + curr.monto, 0) }))
      setCheque(initValueCheque)
    }

    return (

      <>
        <div className="w-full flex flex-col mt-8">
          <div className="flex w-full items-center gap-4 mb-8">
            <p>Cheques Depositados</p>
            <hr className="flex-1"></hr>
            <button
              type="button"
              className="bg-primary-500 hover:bg-primary-600 text-white w-6 h-6 rounded-full"
              onClick={() => setDisplay(prev => !prev)}
            >
              <ChevronDownIcon />
            </button>
          </div>
        </div>
        
        <div className='w-full flex flex-col gap-8'>
        {display &&
          <div className=" flex gap-4">
            <table  className="border-collapse w-full">
              <thead>
                <tr className="border-b-4 border-gray-600 text-left">
                  <th>N° Cheque</th>
                  <th>Monto</th>
                  <th>Librador</th>
                  <th className='w-10'></th>
                </tr>
              </thead>
              <tbody>
                {cheques?.map((cheque) => (
                  <tr className='border-b-2 h-auto p-0 m-0 border-gray-500' key={cheque.numeroCheque}>
                    <td className=''>{cheque.numeroCheque}</td>
                    <td>{Number(cheque.monto).toLocaleString("es-PY")}</td>
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
            <div className="p-2 border-2 w-1/2 border-gray-500 rounded">
              <h2 className="text-xl font-bold my-4 text-center">Informacion del Cheque</h2>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex gap-2">
                  <label>Banco</label>
                  <select
                    className='bg-gray-800 text-white py-1 px-2 rounded-md '
                    value={cheque.bancoChequeId}
                    onChange={onChange}
                    id='bancoChequeId'
                  >
                    <option value="">Banco del cheque</option>
                    {
                      bancos.map(banco => <option key={banco.id} value={banco.id}>{banco.nombre}</option>)
                    }
                  </select>
                </div>
                <div className="flex gap-2 items-center">
                  <label>Monto</label>
                  <Input
                    value={cheque.monto}
                    onChange={(e) => setCheque({ ...cheque, monto: Number(e.target.value) })}
                    placeholder='Ingrese el monto del cheque'
                    id='montoCheque'
                    type='formattedNumber'
                    className='bg-gray-800 text-white py-1 px-2 rounded-md flex-1'
                  />
                </div>
                <div className="flex gap-2">
                  <label>Librador</label>
                  <Input
                    onChange={onChange}
                    value={cheque.involucrado}
                    placeholder='Nombre del librador del cheque'
                    id='involucrado'
                    type='text'
                    className='bg-gray-800 text-white py-1 px-2 rounded-md flex-1'
                  />
                </div>
                <div className="flex gap-2">
                  <label>Emision</label>
                  <InputCalendar
                    value={cheque.fechaEmision}
                    limit={
                      operacion.fechaOperacion.trim() === "" ? undefined :
                      new Date(operacion.fechaOperacion)
                    }
                    handleChange={onChange}
                    id='fechaEmision'
                    className='bg-gray-800 text-white py-1 px-2 rounded-md'
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <input type="checkbox" 
                    checked={esDiferido} 
                    onChange={(e) =>{
                        setEsDiferido(e.target.checked)
                        if(!e.target.checked) setCheque({ ...cheque, fechaPago: undefined })
                      }} 
                    id="esDiferido" />
                  <label htmlFor='esDiferido'>Fecha de Pago</label>
                  <InputCalendar
                    value={cheque.fechaPago || ""}
                    disabled={!esDiferido}
                    min={
                      operacion.fechaOperacion.trim() === "" ? undefined :
                      new Date(operacion.fechaOperacion).toISOString().split('T')[0]
                    }
                    limit={operacion.fechaOperacion ? new Date(new Date(operacion.fechaOperacion).setDate(new Date().getDate() + 180)) : undefined}
                    handleChange={onChange}
                    id='fechaPago'
                    className='disabled:opacity-50 bg-gray-800 text-white py-1 px-2 rounded-md'
                  />
                </div>
                <div className="flex gap-2">
                  <label>N° Cheque</label>
                  <Input
                    value={cheque.numeroCheque}
                    onChange={onChange}
                    placeholder='Numero del cheque'
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
          <div className='flex justify-between bg-gray-800 opacity-80 text-white p-2 rounded'>
            <p>Total de la Operacion</p>
            <p>{monto.toLocaleString('es-ES')} Gs.</p>
          </div>
        </div>
      </>
    )
  }
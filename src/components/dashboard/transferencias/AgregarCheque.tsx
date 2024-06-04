"use client"

import Input from '@/components/global/Input'
import { Banco } from '@prisma/client'
import React, { useState } from 'react'

type ChequeCreate = {
  numeroCheque: string,
  involucrado: string,
  monto: number,
  fechaEmision: Date,
  esRecibido: true,
  bancoChequeId: string,
}

type Props = {
  cheques: ChequeCreate[]
  setCheques: React.Dispatch<React.SetStateAction<ChequeCreate[]>>
  bancos: Banco[]
}

export default function AgregarCheque({
  cheques,
  setCheques,
  bancos
}: Props) {    

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const {name, value, id, type} = e.target
    setCheques(prev => {
      if(type === 'date') return {...prev, [name||id]: new Date(value)}
      return {...prev, [name||id]: value}
    })
  }

  return (
    <div className="w-full flex flex-col">
    <div className="flex w-full items-center gap-4 mb-8">
      <p>Cheques</p>
      <hr className="flex-1"></hr>
      <button className="bg-primary-500 hover:bg-primary-600 text-white p-1 rounded">Add</button>
    </div>
    <div className="w-full flex gap-4">
      <table className="flex-1">
        <thead>
          <tr className="w-full border-b-4 border-gray-600">
            <th>N° Cheque</th>
            <th>Monto</th>
            <th>Librador</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {cheques.map((cheque) => (
              <>
                <td>{cheque.numeroCheque}</td>
                <td>{cheque.monto}</td>
                <td>{cheque.involucrado}</td>
                <td>
                  <button 
                    className='bg-red-500 hover:bg-red-600 text-white p-1 rounded'
                    onClick={() => setCheques(prev => prev.filter(c => c !== cheque))}
                  >
                    Quitar
                  </button>
                </td>
              </>
            ))}
          </tr>
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
              id='monto'
              type='number'
              className='bg-gray-800 text-white py-1 px-2 rounded-md'
            />
          </div>
          <div className="flex gap-2">
            <label>Librador</label>
            <Input 
              onChange={onChange}
              placeholder='Ingrese el nombre del librador del cheque'
              id='involucrado'
              type='text'
              className='bg-gray-800 text-white py-1 px-2 rounded-md'
            />  
          </div>
          <div className="flex gap-2">
            <label>Emision</label>
            <input type="date" ></input>
          </div>
          <div className="flex gap-2">
            <label>N° Cheque</label>
            <Input 
              onChange={onChange}
              placeholder='12345678-A132-098'
              id='cheque'
              type='text'
              className='bg-gray-800 text-white py-1 px-2 rounded-md'
            />  
          </div>
          <button className="bg-primary-500 hover:bg-primary-600 text-white p-1 rounded">Agregar</button>
        </div>
    </div>
  </div>
</div>
  )
}
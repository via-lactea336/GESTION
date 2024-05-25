import Header from '@/components/global/Header'
import React from 'react'

type Props = {}

export default function TarjetaPago({}: Props) {
  return (
    <>
      <div>
        <header
        className={`flex gap-3 justify-between items-center flex-wrap px-8 py-4 w-full rounded-md bg-primary-800 text-white`}
      >
        <h1 className="text-2xl font-bold">Tarjeta Detalle</h1>
        <nav className="flex flex-wrap  items-center gap-6">
          <div className="flex items-center gap-3">
            <p className='text-primary-300 font-bold mr-2'>Arturo Gonzalez</p>
          </div>
          <div className="flex items-center gap-3">
            <p className='text-primary-300 font-bold mr-2'>Caja N°15</p>
          </div>
        </nav>
      </header>
      </div>
        <div className=" my-6 mx-auto bg-gray-800 py-6 px-4 rounded-md shadow-md [min-width:300px]">

          <div className='flex flex-col sm:flex-row gap-8'>
            
            <div className='flex flex-col flex-1'>
              <h2 className='text-xl '>Forma de Pago:</h2>
              <hr className='my-2'></hr>
              <div className='flex flex-col gap-3 h-full justify-center'>
                <div className='flex gap-2'>
                  <input name='tipoTarjeta' id='tDebito' type='radio'></input>
                  <label htmlFor='tDebito'>Tarjeta Debito</label>
                </div>
                <div className='flex gap-2'>
                  <input name='tipoTarjeta' id='tCredito' type='radio'></input>
                  <label htmlFor='tCredito'>Tarjeta Credito</label>
                </div>
                <div className='flex items-center'>
                  <label className='bg-gray-700 p-1 rounded-l text-gray-300 inner-none border-none' htmlFor='banco'>Banco</label>
                  <input name='banco' className='p-1 rounded-r' type='text' placeholder='BANCO GNB'></input>
                </div>
              </div>
            </div>

            <div className=' flex-1'>
              <h2 className='text-xl '>Datos del Pago:</h2>
              <hr className='my-2'></hr>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center w-full'>
                  <label className='bg-gray-700 p-1 rounded-l text-gray-300' htmlFor='banco'>N° Tarjeta</label>
                  <input name='banco' className='p-1 rounded-r flex-1' type='text' placeholder='4242 4242 4242 4242'></input>
                </div>
                
                <div className='flex flex-wrap gap-3 flex-1'>
                  <div className='flex items-center'>
                    <label className='bg-gray-700 p-1 rounded-l text-gray-300 ' htmlFor='banco'>Exp</label>
                    <input name='banco' className='p-1 rounded-r flex-1' type='date' ></input>
                  </div>
                  <div className='flex items-center flex-1'>
                    <label className='bg-gray-700 p-1 rounded-l text-gray-300' htmlFor='banco'>CVV</label>
                    <input name='banco' className='p-1 rounded-r flex-1' type='text' placeholder='123'></input>
                  </div>
                </div>
                
                <div className='flex items-center w-full'>
                  <label className='bg-gray-700 p-1 rounded-l text-gray-300' htmlFor='banco'>Importe</label>
                  <input name='banco' className='p-1 rounded-r flex-1' type='number' placeholder='200.000 Gs.'></input>
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-3 justify-around'>
            <button className='bg-gray-700 p-3 hover:bg-gray-600 rounded-md text-white w-1/3 mt-6'>Cancelar</button>
            <button className='bg-primary-700 p-3 hover:bg-primary-600 rounded-md text-white w-1/3 mt-6'>Pagar</button>
          </div>

        </div>      
    </>
  )
}
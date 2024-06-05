"use client";

import Header from '@/components/global/Header'
import InputCalendar from '@/components/global/InputCalendar';
import LoadingPage from '@/components/global/LoadingPage';
import obtenerReportes from '@/lib/moduloCaja/obtenerReportes';
import { fetchPlus } from '@/lib/verificarApiResponse'
import { Caja } from '@prisma/client';
import React, { useEffect } from 'react'
import { ParamsReportes } from '@/lib/moduloCaja/obtenerReportes';

export default function Reportes() {

  const [loading, setLoading] = React.useState(true);
  const [cajas, setCajas] = React.useState<Caja[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const [reporteParam, setReporteParam] = React.useState<ParamsReportes>({
    cajaId: null,
    fechaDesde: null,
    fechaHasta: null
  })

  const getCajasEffect = async () => {
    const {data, error} = await fetchPlus<Caja[]>("/api/caja",{"cache": "no-store"});
    if(error) setError(error)
    if(data) setCajas(data)
  }

  const handleObtenerReportes = async () => {
    try{
      const {data, error} = await obtenerReportes(reporteParam)
      if(data) console.log(data)
    }catch(error){
      if(error instanceof Error) console.error(error.message)
    }
  }

  const onChange = (e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >) => {
    const {name, value, type} = e.target
    setReporteParam(prev => {
      if(type === 'date') return {...prev, [name]: value}
      return {...prev, [name]: value}
    })
  }

  useEffect(() => {
    getCajasEffect()
    setLoading(false)
  }, [])

  if(loading) return <LoadingPage />

  if(error) return <p className='text-red-500'>Error al obtener las cajas</p>

  return (
    <div className='flex flex-col gap-8'>
      <Header title='Reportes'>
        <div className='flex w-full gap-8 items-center'>
          <div className='flex gap-2 items-center'>
            <label className='w-18'>Caja N°</label>
            <select
              name='cajaId'
              value={reporteParam.cajaId || ''}
              onChange={onChange}
              className='bg-gray-800 text-white py-1 px-2 rounded-md '
            >
              <option value={""}>Seleccione una caja</option>
              {cajas.map(caja => <option key={caja.id} value={caja.id}>{`Caja N° ${caja.numero}`}</option>)}
            </select>
          </div>

          <div className='flex flex-col gap-2 items-center'>
            <div className='flex items-center gap-2'>
              <label htmlFor='fechaDesde'>Fecha Desde:</label>
              <InputCalendar 
                value={reporteParam.fechaDesde?.toString() || ''}
                handleChange={onChange}
                className='bg-gray-800 text-white py-1 px-2 rounded-md'
                id='fechaDesde' 
              />
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='fechaHasta'>Fecha Hasta:</label>
              <InputCalendar 
                value={reporteParam.fechaHasta?.toString() || ''}
                handleChange={onChange}
                className='bg-gray-800 text-white py-1 px-2 rounded-md'
                id='fechaHasta' 
              />
            </div>
          </div>

          <button 
            className='bg-gray-800 h-12 hover:bg-gray-700 text-white p-2 rounded'
            onClick={async () => await handleObtenerReportes()}
          >
            Buscar
          </button>
          
          <button 
            className='bg-primary-600 h-12 hover:bg-primary-500 text-white p-2 rounded'
            onClick={async () => await handleObtenerReportes()}
          >
            Generar
          </button>

        </div>
      </Header>

      <div className="flex-grow bg-gray-800 rounded-md p-5 flex flex-col">
        {(!reporteParam.cajaId || !reporteParam.fechaDesde || !reporteParam.fechaHasta) && <p>Ingrese los parametros del reporte...</p>}
      </div>

    </div>
  )
}
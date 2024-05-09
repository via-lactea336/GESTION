"use client"

import obtenerOperacionPorId from '@/lib/operacion/obtenerOperacionPorId'
import { useEffect, useState } from 'react'
import { OperacionDetails } from '@/lib/definitions'

export default function page() {

  const [data, setData] = useState<OperacionDetails|null>(null)

  const test = async ()=>{
    const operacion = await obtenerOperacionPorId("41eff1c2-e61e-41e0-b91a-0ce27b543247")

    if(typeof(operacion) === "string" || operacion === undefined ) return <div>{operacion || 'Cuentas no encontradas'}</div>

    if(operacion.data) setData(operacion.data)
  }

  useEffect(()=>{
    test()
  }, [])
  

  return (
    <div>{
      <p>{data?.cuentaBancariaOrigen.banco.nombre}</p>
    }</div>
  )
}
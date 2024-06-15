import prisma from '@/lib/prisma'
import React from 'react'

type Props = {}

export default async function Asiento({}: Props) {

  const asientos = await prisma.asiento.findMany({
    include:{
      detalles: {
        include:{
          cuenta: true
        }
      }
    }
  })

  console.log(asientos)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asientos Contables</h1>

      <table className="min-w-full border-1 border-gray-800 rounded shadow">
        <thead className="bg-gray-900">
          <tr>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Cuenta</th>
            <th className="px-4 py-2">Debe</th>
            <th className="px-4 py-2">Haber</th>
          </tr>
        </thead>
        <tbody>
          {asientos.map(asiento =>
            asiento.detalles.map(detalle => (
              <tr key={detalle.id}>
                <td className="border px-4 py-2">{new Date(asiento.fecha).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{asiento.descripcion}</td>
                <td className="border px-4 py-2">{detalle.cuenta.nombre}</td>
                <td className="border px-4 py-2">{detalle.esDebe ? +detalle.monto : ''}</td>
                <td className="border px-4 py-2">{!detalle.esDebe ? +detalle.monto : ''}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
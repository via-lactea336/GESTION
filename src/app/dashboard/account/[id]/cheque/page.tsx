"use client"

import obtenerBancos from '@/lib/banco/obtenerBancos'
import concicliarCheque from '@/lib/cheque/conciliarCheque'
import obtenerChequesFiltros from '@/lib/cheque/obtenerChequesFiltros'
import { ChequeDetails } from '@/lib/definitions'
import { ArrowDownLeftIcon, ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { type Cheque, estadoCheque, Banco } from '@prisma/client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import React, { useEffect } from 'react'
import detalleCheques from '../../../../../components/PDF/ChequesDetalles'

export default function Cheque({ params }: { params: { id: string } }) {

  const { id } = params

  const quantityPerPage = parseInt(process.env.QUANTITY_PER_PAGE || "4")

  const [cheques, setCheques] = React.useState<ChequeDetails[]>([])
  const [loadingContentPage, setLoadingContentPage] = React.useState(true)
  const [loadingTable, setLoadingTable] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [bancos, setBancos] = React.useState<Banco[]>([])
  const [indicesPagina, setindicesPagina] = React.useState(0)
  const [indiceActual, setIndiceActual] = React.useState(0)

  const [filtro, setFiltro] = React.useState<{
    upTo: number,
    skip: number,
    cuentaId: string,
    fechaDesde?: string,
    fechaHasta?: string,
    bancoChequeId?: string,
    estado?: estadoCheque,
    montoDesde?: number,
    montoHasta?: number
  }>({
    upTo: quantityPerPage,
    skip: 0,
    cuentaId: id,
  }
  )

  const obtenerBancosHandler = async () => {

    const bancosRes = await obtenerBancos()

    if (typeof (bancosRes) === 'string' || bancosRes === undefined) {
      setError(bancosRes || "Error al obtener los bancos para el filtro")
      setLoadingContentPage(false)
      return
    }

    setBancos(bancosRes.data)
    setLoadingContentPage(false)
  }

  const obtenerChequesFiltroHandler = async () => {
    setLoadingTable(true)
    const response = await obtenerChequesFiltros(filtro)

    if (typeof (response) === 'string' || response === undefined) {
      setError(response || "Error al obtener los cheques")
      setLoadingContentPage(false)
      return
    }

    setCheques(response.data.values)
    setindicesPagina(response.data.totalQuantity % quantityPerPage === 0 ? response.data.totalQuantity / quantityPerPage : Math.floor(response.data.totalQuantity / quantityPerPage) + 1)

    setLoadingTable(false)
  }

  useEffect(() => {
    obtenerBancosHandler()
  }, [])

  useEffect(() => {
    obtenerChequesFiltroHandler()
  }, [indiceActual])

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFiltro({
      ...filtro,
      [name]: value === "" ? undefined : value
    })
  }

  const onKeyDownHandleForNumberInputs = (e: React.KeyboardEvent) => {
    if (e.key === "e" || e.key === "-") {
      e.preventDefault()
    }
  }

  const changeIndicePagina = async (indice: number) => {
    setIndiceActual(indice)
    setFiltro({
      ...filtro,
      skip: indice * quantityPerPage
    })
  }


  const handleConciliar = async (id: string) => {

    const response = await concicliarCheque(id)

    if (typeof (response) === 'string' || response === undefined) {
      setError(response || "Error al conciliar el cheque")
      setLoadingContentPage(false)
      return
    }

    const prevCheques = [...cheques]
    setCheques(prevCheques.map(cheque => cheque.id === id ? { ...cheque, estado: estadoCheque.PAGADO } : cheque))
  }

  const handleAnular = async (id: string) => {
    console.log("anulado")
  }

  if (loadingContentPage) return <h1>Loading...</h1>

  if (error) return <h1>{error}</h1>

  return (
    <div className="flex flex-col h-full -mt-8">
      <header className="flex gap-3 justify-between items-center flex-wrap px-8 py-4 w-full rounded-md bg-primary-800 text-white">
        <h1 className="text-2xl font-bold">Cheques</h1>

        <nav className="flex flex-wrap items-center gap-6">

          <div className="flex items-center gap-3">
            <h3 className="mr-2">Bancos</h3>
            <select
              className="bg-gray-800 text-white py-1 px-2 rounded-md"
              name='bancoChequeId'
              onChange={handleOnChange}
            >
              <option value={""}>Todos</option>
              {
                bancos.map((banco, index) => <option key={index} value={banco.id}>{banco.nombre}</option>)
              }
            </select>
          </div>

          <div className="flex items-center gap-3">
            <h3 className="mr-2">Estado</h3>
            <select
              className="bg-gray-800 text-white py-1 px-2 rounded-md"
              name='estado'
              onChange={handleOnChange}
            >
              <option value={""}>Todos</option>
              {
                Object.values(estadoCheque).map((estadoCheque, index) => <option key={index} value={estadoCheque}>{estadoCheque}</option>)
              }
            </select>
          </div>

          <div className='flex flex-col items-center gap-3'>
            <input
              onChange={handleOnChange}
              onKeyDown={onKeyDownHandleForNumberInputs}
              className='bg-gray-800 text-white py-1 px-2 rounded' placeholder='Monto Desde' type="number"
              name="montoDesde" id="montoDesde" />
            <input
              onChange={handleOnChange}
              onKeyDown={onKeyDownHandleForNumberInputs}
              className='bg-gray-800 text-white py-1 px-2 rounded' placeholder='Monto Hasta' type="number"
              name="montoHasta" id="montoHasta" />
          </div>

        </nav>
        <button
          onClick={async () => { await obtenerChequesFiltroHandler() }}
          className='bg-gray-800 hover:bg-gray-900 text-white  py-2 px-4 rounded'
        >
          Filtrar
        </button>
        <button
          className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          <PDFDownloadLink
            document={<detalleCheques
              operaciones={operaciones}
              cuenta={accountData}
            //concepto={concepto}
            />}
            fileName="detalle-cuentas.pdf"
          >
            {
              ({ loading, url, error, blob }) =>
                loading ? (
                  <button> Cargando documento... </button>
                ) : (
                  <button>Descargar</button>
                )
            }
          </PDFDownloadLink>
        </button>
      </header>

      <h2 className="text-xl font-bold my-4">Lista de Cheques</h2>

      <div className="flex-grow bg-gray-800 rounded-md p-5 flex flex-col">
        {
          !loadingTable ? (
            <>
              <table className="border-collapse w-full">
                <thead>
                  <tr>
                    <th><span className='text-md mt-1 text-primary-400 font-normal'>Operacion</span></th>
                    <th><span className='text-md mt-1 text-primary-400 font-normal'>Fecha</span></th>
                    <th><span className='text-md mt-1 text-primary-400 font-normal'>Banco</span></th>
                    <th><span className='text-md mt-1 text-primary-400 font-normal'>Estado</span></th>
                    <th><span className='text-md mt-1 text-primary-400 font-normal'>Monto</span></th>
                    <th><span className='text-md mt-1 text-primary-400 font-normal'>Accion</span></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    cheques.map((cheque) => (
                      <tr key={cheque.id}>
                        <td className="py-2">
                          <div className="w-7 h-7 ml-5">
                            {!cheque.esRecibido ? (
                              <ArrowUpRightIcon className="text-red-500" />
                            ) : (
                              <ArrowDownLeftIcon className="text-green-500" />
                            )}
                          </div>
                        </td>
                        <td>{cheque.fechaEmision.toString().split("T")[0]}</td>
                        <td>{cheque.bancoCheque.nombre}</td>
                        <td>{cheque.estado === estadoCheque.PAGADO ? <span className='bg-green-500 p-1 rounded'>{estadoCheque.PAGADO}</span> : <span className='bg-red-500 p-1 rounded'>{estadoCheque.EMITIDO}</span>}</td>
                        <td>{Number(cheque.monto).toLocaleString()}</td>
                        <td>
                          <div className='flex gap-2'>
                            <button
                              disabled={cheque.estado === estadoCheque.PAGADO}
                              onClick={async () => await handleConciliar(cheque.id)}
                              className='disabled:opacity-50 disabled:cursor-not-allowed border-gray-700 border-2 hover:bg-green-900 p-1 rounded'>
                              Conciliar
                            </button>
                            <button
                              onClick={async () => await handleAnular(cheque.id)}
                              className='border-gray-700 border-2 hover:bg-red-900 p-1 rounded'>
                              Anular
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-2 ">
                <button
                  onClick={async () => await changeIndicePagina(indiceActual - 1)}
                  disabled={indiceActual - 1 === -1}
                  className='w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 rounded' >
                  <ChevronLeftIcon />
                </button>
                <div className='gap-2 flex'>
                  {
                    [...Array(indicesPagina)].map((_, index) => (
                      <button
                        key={index}
                        onClick={async () => await changeIndicePagina(index)}
                        className={(index === indiceActual ? "opacity-50 cursor-not-allowed " : "hover:bg-gray-900 ") + "px-6 py-2 bg-gray-700 rounded"}>
                        <span className={"cursor-pointer m-auto"}>{index + 1}</span>
                      </button>
                    ))
                  }
                </div>
                <button
                  disabled={indiceActual + 1 === indicesPagina}
                  onClick={async () => await changeIndicePagina(indiceActual + 1)}
                  className={'w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 rounded'}>
                  <ChevronRightIcon />
                </button>
              </div>
            </>
          ) :
            cheques.length != 0 ?
              <h1 className='text-red-500 text-2xl'>No hay cheques en la cuenta</h1>
              :
              <h1 className='text-red-500 text-2xl'>No hay cheques en la cuenta</h1>
        }
      </div>

    </div>
  )
}
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Header from '@/components/global/Header'
import InputCalendar from '@/components/global/InputCalendar';
import LoadingPage from '@/components/global/LoadingPage';
import { ArrowTopRightOnSquareIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { fetchPlus } from "@/lib/verificarApiResponse";
import { Caja } from "@prisma/client";
import React, { useEffect, useState } from "react";
import obtenerAperturasFiltro from '@/lib/moduloCaja/aperturaCaja/obtenerAperturasFiltro';
import { Data } from "@/lib/moduloCaja/aperturaCaja/obtenerAperturasFiltro";
import { useRouter } from "next/navigation";

type ReporteParams = {
  cajaId: string | undefined;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
  skip: number;
  upto: number;
};
export default function Reportes() {
  const reportesPorPagina = 8;
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [cajas, setCajas] = React.useState<Caja[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [registros, setRegistros] = React.useState<Data[]>();
  const [reporteParam, setReporteParam] = React.useState<ReporteParams>({
    cajaId: undefined,
    fechaDesde: null,
    fechaHasta: null,
    skip: 0,
    upto: reportesPorPagina,
  });

  
  const [indicesPagina, setindicesPagina] = useState(0);
  const [indiceActual, setIndiceActual] = useState(0);

  
  const changeIndicePagina = async (indice: number) => {
    setIndiceActual(indice);
    setReporteParam({
      ...reporteParam,
      skip: indice * reportesPorPagina,
    });
  };

  const getCajasEffect = async () => {
    const { data, error } = await fetchPlus<Caja[]>("/api/caja", {
      cache: "no-store",
    });
    if (error) setError(error);
    if (data) setCajas(data);
  };

  const getRegistrosEffect = async () => {
    const { data, error } = await obtenerAperturasFiltro({
      fechaDesde: reporteParam.fechaDesde?.toDateString(),
      fechaHasta: reporteParam.fechaHasta?.toDateString(),
      cerrada: true,
      cajaId: reporteParam.cajaId,
      skip: reporteParam.skip,
      upTo: reporteParam.upto,
    });
    if (error) setError(error);
    setRegistros(data?.values);
    if(data != undefined){
      setindicesPagina(
        data.totalQuantity % reportesPorPagina === 0
          ? data.totalQuantity / reportesPorPagina
          : Math.floor(data.totalQuantity / reportesPorPagina) + 1
      );
    }
    console.log(data);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, id, type } = e.target;
    setReporteParam((prev) => {
      if (type === "date") return { ...prev, [name || id]: new Date(value) };
      return { ...prev, [name || id]: value };
    });
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value, id } = e.target;
    setReporteParam((prev) => ({ ...prev, [name || id]: value }));
  };

  const redirecting = (id : string) =>{
    router.push(`/dashboard/caja/reportes/${id}`)
  }

  useEffect(() => {
    getRegistrosEffect()
    getCajasEffect()
    setLoading(false)
  }, [reporteParam])

  if (loading) return <LoadingPage />;

  if (error) return <p className="text-red-500">Error al obtener las cajas</p>;

  return (
    <div className="flex flex-col gap-8 -mt-7">
      <Header title="Reportes">
        <div className="flex w-full gap-8 items-center">
          <div className="flex gap-2 items-center">
            <label className="w-18">Caja N°</label>
            <select
              name="cajaId"
              value={reporteParam.cajaId || ""}
              onChange={onChangeSelect}
              className="bg-gray-800 text-white py-1 px-2 rounded-md "
            >
              <option value={""}>Seleccione una caja</option>
              {cajas.map((caja) => (
                <option
                  key={caja.id}
                  value={caja.id}
                >{`Caja N° ${caja.numero}`}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="fechaDesde">Fecha Desde:</label>
            <InputCalendar
              value={reporteParam.fechaDesde?.toString() || ""}
              handleChange={onChange}
              className="bg-gray-800 text-white py-1 px-2 rounded-md"
              id="fechaDesde"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="fechaHasta">Fecha Hasta:</label>
            <InputCalendar
              value={reporteParam.fechaHasta?.toString() || ""}
              handleChange={onChange}
              className="bg-gray-800 text-white py-1 px-2 rounded-md"
              id="fechaHasta"
            />
          </div>
        </div>
      </Header>

      <div>
        <table className="table-auto mx-auto text-center w-full border-separate border-spacing-0">
          <thead className="bg-primary-500">
            <tr>
              <td className="border-b border-gray-400 px-4 py-2">Fecha</td>
              <td className="border-b border-gray-400 px-4 py-2">N° Caja</td>
              <td className="border-b border-gray-400 px-4 py-2">Cajero</td>
              <td className="border-b border-gray-400 px-4 py-2">Total Ingresos</td>
              <td className="border-b border-gray-400 px-4 py-2">Total Egresos</td>
              <td className="border-b border-gray-400 px-4 py-2">Ver Detalle</td>
            </tr>
          </thead>
          <tbody>
            {registros?.map((registro, index) =>(
              <tr key={index}>
                <td className='border-b border-gray-300 px-4 py-2'>{new Date(registro.createdAt)
                            .toISOString()
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("/")}</td>
                <td className='border-b border-gray-300 px-4 py-2'>{registro.caja.numero}</td>
                <td className='border-b border-gray-300 px-4 py-2'>{registro.cajero.nombre + " " + registro.cajero.apellido}</td>
                <td className='border-b border-gray-300 px-4 py-2'>{Number(registro.registro.montoIngresoTotal)}</td>
                <td className='border-b border-gray-300 px-4 py-2'>{Number(registro.registro.montoEgresoTotal)}</td>
                <td className='border-b border-gray-300 px-4 py-2'>
                  <button onClick={() => redirecting(registro.id)}>
                  {<ArrowTopRightOnSquareIcon className='w-6 h-6 ml-auto mt-2 mr-auto'/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-around items-center mt-2 ">
          <button
            onClick={async () => await changeIndicePagina(indiceActual - 1)}
            disabled={indiceActual - 1 === -1}
            className="w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 rounded"
          >
            <ChevronLeftIcon />
          </button>
          <div className="gap-2 flex">
            {[...Array(indicesPagina)].map((_, index) => (
              <button
                key={index}
                onClick={async () => await changeIndicePagina(index)}
                className={
                  (index === indiceActual
                    ? "opacity-50 cursor-not-allowed "
                    : "hover:bg-gray-900 ") + "px-6 py-2 bg-gray-700 rounded"
                }
              >
                <span className={"cursor-pointer m-auto"}>{index + 1}</span>
              </button>
            ))}
          </div>
          <button
            onClick={async () => await changeIndicePagina(indiceActual + 1)}
            disabled={indiceActual + 1 === indicesPagina}
            className={
              "w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 rounded"
            }
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

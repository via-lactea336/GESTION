/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Header from '@/components/global/Header'
import InputCalendar from '@/components/global/InputCalendar';
import LoadingPage from '@/components/global/LoadingPage';
import { EyeIcon } from '@heroicons/react/24/outline';

import { fetchPlus } from "@/lib/verificarApiResponse";
import { Caja, RegistroCaja } from "@prisma/client";
import React, { useEffect } from "react";
import obtenerAperturasFiltro from '@/lib/moduloCaja/aperturaCaja/obtenerAperturasFiltro';

type ReporteParams = {
  cajaId: string | undefined;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
  skip: number;
  upto: number;
};

export default function Reportes() {
  const [loading, setLoading] = React.useState(true);
  const [cajas, setCajas] = React.useState<Caja[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [registros, setRegistros] = React.useState<[]>();
  const [reporteParam, setReporteParam] = React.useState<ReporteParams>({
    cajaId: undefined,
    fechaDesde: null,
    fechaHasta: null,
    skip: 0,
    upto: 8,
  });

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
      cerrarda: true,
      cajaId: reporteParam.cajaId,
      skip: 0,
      upTo: 10,
    });
    if (error) setError(error);
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

  useEffect(() => {
    getRegistrosEffect()
    getCajasEffect()
    setLoading(false)
  }, [reporteParam])

  if (loading) return <LoadingPage />;

  if (error) return <p className="text-red-500">Error al obtener las cajas</p>;

  return (
    <div className="flex flex-col gap-8">
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

          <div className="flex flex-col gap-2 items-center">
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

          <button className="bg-gray-800 h-12 hover:bg-gray-700 text-white p-2 rounded">
            Buscar
          </button>

          <button className="bg-primary-600 h-12 hover:bg-primary-500 text-white p-2 rounded">
            Generar
          </button>
        </div>
      </Header>

      <div>
        <table className="table-auto mx-auto text-center w-full border-separate border-spacing-0">
          <thead className="bg-primary-500">
            <tr>
              <td className="border-b border-gray-400 px-4 py-2">Fecha</td>
              <td className="border-b border-gray-400 px-4 py-2">N° Caja</td>
              <td className="border-b border-gray-400 px-4 py-2">
              Total Ingresos
            </td>
              <td className="border-b border-gray-400 px-4 py-2">
              Total Egresos
            </td>
              <td className="border-b border-gray-400 px-4 py-2">Ver Detalle</td>
            </tr>
          </thead>
          <tbody>
            {registros?.map((registro, index) =>(
              <tr key={index}>
                <td className='border-b border-gray-300 px-4 py-2'>{new Date()
                            .toISOString()
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("/")}</td>
                <td className='border-b border-gray-300 px-4 py-2'>2</td>
                <td className='border-b border-gray-300 px-4 py-2'>{Number(1)}</td>
                <td className='border-b border-gray-300 px-4 py-2'>{Number(1)}</td>
                <td className='border-b border-gray-300 px-4 py-2'>{<EyeIcon className='w-6 h-6 ml-auto mr-auto'/>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

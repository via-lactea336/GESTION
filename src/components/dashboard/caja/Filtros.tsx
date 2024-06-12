"use client";
import InputCalendar from "@/components/global/InputCalendar";
import { ParamsReportes } from "@/lib/moduloCaja/movimiento/obtenerMovimientosFiltro";
import { fetchPlus } from "@/lib/verificarApiResponse";
import { Caja } from "@prisma/client";
import React, { useEffect, useState } from "react";

type Props = {
  filter: ParamsReportes;
  setFilter: React.Dispatch<React.SetStateAction<ParamsReportes>>;
};

export default function Filtros({ filter, setFilter }: Props) {
  const [cajas, setCajas] = useState<Caja[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, id, type } = e.target;
    setFilter((prev) => {
      if (type === "date") return { ...prev, [name || id]: value };
      return { ...prev, [name || id]: value };
    });
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value, id } = e.target;
    setFilter((prev) => ({ ...prev, [name || id]: value }));
  };

  const getCajasEffect = async () => {
    const { data, error } = await fetchPlus<Caja[]>("/api/caja", {
      cache: "no-store",
    });
    if (error) return;
    if (data) setCajas(data);
  };

  useEffect(() => {
    getCajasEffect();
  }, []);

  return (
    <div className="flex w-full gap-8 items-center bg-gray-800 p-4 mt-4 rounded-md">
      <div className="flex gap-2 items-center">
        <select
          name="cajaId"
          value={filter.cajaId || ""}
          onChange={onChangeSelect}
          className="bg-gray-900 text-white py-1 px-2 rounded-md "
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
          value={filter.fechaDesde?.toString() || ""}
          handleChange={onChange}
          className="bg-gray-900 text-white py-1 px-2 rounded-md"
          id="fechaDesde"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="fechaHasta">Fecha Hasta:</label>
        <InputCalendar
          value={filter.fechaHasta?.toString() || ""}
          min={filter.fechaDesde}
          handleChange={onChange}
          className="bg-gray-900 text-white py-1 px-2 rounded-md"
          id="fechaHasta"
        />
      </div>
    </div>
  );
}

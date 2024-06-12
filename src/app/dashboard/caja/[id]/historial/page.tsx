"use client";
import Header from "@/components/global/Header";
import useCookies from "@/lib/hooks/useCookies";
import Link from "next/link";
import Table from "@/components/global/Table";
import { useState } from "react";
import Search from "@/components/global/Search";
import Pagination from "@/components/global/Pagination";
import { ParamsReportes } from "@/lib/moduloCaja/movimiento/obtenerMovimientosFiltro";

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
  };
  params: {
    id: string;
  };
};

export default function Page({ params, searchParams }: Props) {
  const { id } = params;
  const { cajero, caja } = useCookies();
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query || "";
  const links = [
    { href: `/dashboard/caja/${id}/arqueo`, text: "Arqueo" },
    { href: `/dashboard/caja/reportes`, text: "Reportes" },
    { href: `/dashboard/caja/${id}/egreso`, text: "Egreso" },
  ];

  const [filter, setFilter] = useState<ParamsReportes>({
    cajaId: id,
    fechaDesde: "",
    fechaHasta: "",
    skip: 0,
    upTo: 8,
    incluirDocumentacion: true,
  });

  return (
    <div>
      <Header title="Historial De Caja" className="-mt-8">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="bg-gray-800 py-1 px-2 rounded-md hover:text-primary-100 hover:bg-gray-900 mx-2"
          >
            {link.text}
          </Link>
        ))}
        {!cajero ? (
          <div className="animate-pulse bg-gray-300 py-2 px-10 rounded-md mx-2" />
        ) : (
          <h3 className="ml-8">{cajero.nombre}</h3>
        )}
        {!caja ? (
          <div className="animate-pulse bg-gray-300 py-2 px-10 rounded-md mx-2" />
        ) : (
          <h3>Caja N° {caja.numero}</h3>
        )}
      </Header>
      <div className="flex justify-center items-center gap-8 mt-8">
        <Search placeholder="Buscar por N° de Factura o N° de Comprobante. Ej: 001-001-000123" />
      </div>
      <Table {...filter} currentPage={currentPage} setFilter={setFilter} />
    </div>
  );
}

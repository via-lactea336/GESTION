"use client";
import Header from "@/components/global/Header";
import useCookies from "@/lib/hooks/useCookies";
import Link from "next/link";
import Table from "@/components/global/Table";
import { useEffect, useState } from "react";
import Search from "@/components/global/Search";
import {
  MovimientosFiltroData,
  ParamsReportes,
} from "@/lib/moduloCaja/movimiento/obtenerMovimientosFiltro";
import Filtros from "@/components/dashboard/caja/Filtros";

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
  const { cajero, caja, loading } = useCookies();
  const currentPage = Number(searchParams?.page) || 1;
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientosFiltroData>();
  const query = searchParams?.query || "";
  const links = [
    { href: `/dashboard/caja/${id}/ingreso`, text: "Ingreso" },
    { href: `/dashboard/caja/${id}/egreso`, text: "Egreso" },
    { href: `/dashboard/caja/${id}/arqueo`, text: "Arqueo" },
    { href: `/dashboard/caja/reportes`, text: "Reportes" },
  ];

  const [filter, setFilter] = useState<ParamsReportes>({
    cajaId: "",
    fechaDesde: "",
    fechaHasta: "",
    skip: (currentPage - 1) * 8,
    upTo: 8,
    incluirDocumentacion: true,
    identificadorDocumento: query,
  });
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative">
      <Header
        title="Historial De Caja"
        className={
          showModal
            ? "blur-sm brightness-50 -mt-8"
            : "inline-block min-w-full align-middle -mt-8"
        }
      >
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="bg-gray-800 py-1 px-2 rounded-md hover:text-primary-100 hover:bg-gray-900 mx-2"
          >
            {link.text}
          </Link>
        ))}
        {!cajero && loading ? (
          <div className="animate-pulse bg-gray-300 py-2 px-10 rounded-md mx-2" />
        ) : (
          <h3 className="ml-8">{cajero && cajero.nombre}</h3>
        )}
        {!caja && loading ? (
          <div className="animate-pulse bg-gray-300 py-2 px-10 rounded-md mx-2" />
        ) : (
          <h3>{caja && `Caja N° ${caja.numero}`}</h3>
        )}
      </Header>
      <div
        className={
          "flex justify-center items-center gap-8 my-4" +
          (showModal ? " blur-sm brightness-50" : "")
        }
      >
        <Search placeholder="Buscar por N° de Factura o N° de Comprobante. Ej: 001-001-000123" />
      </div>
      <Table
        {...filter}
        query={query}
        currentPage={currentPage}
        setFilter={setFilter}
        caja={caja}
        cajero={cajero}
        setShowModal={setShowModal}
        showModal={showModal}
        initialMovimientoId=""
        selectedMovimiento={selectedMovimiento}
        setSelectedMovimiento={setSelectedMovimiento}
      />
    </div>
  );
}

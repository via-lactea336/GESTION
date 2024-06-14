"use client";
import Header from "@/components/global/Header";
import useCookies from "@/lib/hooks/useCookies";
import Link from "next/link";
import Table from "@/components/global/Table";
import { useEffect, useState } from "react";
import Search from "@/components/global/Search";
import { ParamsReportes } from "@/lib/moduloCaja/movimiento/obtenerMovimientosFiltro";
import Filtros from "@/components/dashboard/caja/Filtros";
import { CajeroWithRole } from "@/components/dashboard/caja/HistorialData";

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
  const query = searchParams?.query || "";
  const links = [
    { href: `/dashboard/caja/inicio`, text: "Inicio" },
    { href: `/dashboard/caja/resumen`, text: "Resumen" },
    { href: `/dashboard/caja/reportes`, text: "Reportes" },
  ];

  const [filter, setFilter] = useState<ParamsReportes>({
    cajaId: id,
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
      </Header>
      <Filtros showModal={showModal} filter={filter} setFilter={setFilter} />
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
        isAdmin={true}
      />
    </div>
  );
}

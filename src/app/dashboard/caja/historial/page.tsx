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
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { id } = params;
  const { cajero, caja, loading } = useCookies();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";
  const showModalFromParams = searchParams.get("showModal") === "true";
  const router = useRouter();

  const links = [
    { href: `/dashboard/caja`, text: "Cajas" },
    {
      href: `/dashboard/caja/panelDeAdministracion`,
      text: "Panel de Administración",
    },
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
  const [showModal, setShowModal] = useState(showModalFromParams);
  // obtener de la url el movimientoId si es que lo hay
  const initialMovimientoId = searchParams.get("movimientoId") ?? "";
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientosFiltroData>();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (showModal) {
      params.set("showModal", "true");
      if (initialMovimientoId) {
        params.set("movimientoId", initialMovimientoId);
      }
    } else {
      params.delete("showModal");
      params.delete("movimientoId");
    }
    router.replace(`${window.location.pathname}?${params.toString()}`);
  }, [
    showModal,
    setSelectedMovimiento,
    initialMovimientoId,
    selectedMovimiento,
    router,
    searchParams,
  ]);

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
        selectedMovimiento={selectedMovimiento}
        setSelectedMovimiento={setSelectedMovimiento}
        initialMovimientoId={initialMovimientoId}
      />
    </div>
  );
}

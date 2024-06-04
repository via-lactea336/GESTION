"use client";
import CheckoutWizard from "@/components/cajaVentanasEmergentes/Paginacion";
import Header from "@/components/global/Header";
import { Cajero } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { Caja } from "@prisma/client";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const cajero: Cajero = obtenerCookie("cajero");
  const caja: Caja = obtenerCookie("caja");
  const { id } = params;

  const links = [
    { href: `/dashboard/caja/${id}/arqueo`, text: "Arqueo" },
    { href: `/dashboard/caja/${id}/resumenDiario`, text: "Resumen Diario" },
    { href: `/dashboard/caja/${id}/egreso`, text: "Egreso" },
  ];

  return (
    <>
      <Header title="Cobro Facturas" className="-mt-8">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="bg-gray-800 p-1 rounded-md hover:text-primary-100"
          >
            {link.text}
          </Link>
        ))}
        <h3>{cajero.nombre}</h3>
        <h3>Caja N° {caja.numero}</h3>
      </Header>
      <CheckoutWizard />
    </>
  );
}

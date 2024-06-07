"use client";
import Header from "@/components/global/Header";
import { Cajero } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { Caja } from "@prisma/client";
import PagoFactura from "@/components/cajaVentanasEmergentes/PagoFactura";
import Link from "next/link";
import useCookies from "@/lib/hooks/useCookies";

export default function Page({ params }: { params: { id_factura: string } }) {
  const { cajero, caja } = useCookies();
  const { id_factura } = params;

  return (
    <>
      <Header title="Cobro Facturas" className="-mt-8">
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
      <PagoFactura idFactura={id_factura} />
    </>
  );
}

"use client";
import Header from "@/components/global/Header";
import { Cajero } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { Caja } from "@prisma/client";
import PagoFactura from "@/components/cajaVentanasEmergentes/PagoFactura";
import Link from "next/link";

export default function Page({ params }: { params: { id_factura: string } }) {
  const cajero: Cajero = obtenerCookie("cajero");
  const caja: Caja = obtenerCookie("caja");
  const { id_factura } = params;

  return (
    <>
      <Header title="Cobro Facturas" className="-mt-8">        
        <h3>{cajero.nombre}</h3>
        <h3>Caja N° {caja.numero}</h3>
      </Header>
      <PagoFactura idFactura={ id_factura }/>
    </>
  );
}

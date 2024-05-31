"use client";
import CheckoutWizard from "@/components/cajaVentanasEmergentes/Paginacion";
import Header from "@/components/global/Header";
import { Cajero } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { Caja } from "@prisma/client";
export default function Page() {
  const cajero: Cajero = obtenerCookie("cajero");
  const caja: Caja = obtenerCookie("caja");
  return (
    <>
      <Header title="Punto de venta" className="-mt-8">
        <h3>{cajero.nombre}</h3>
        <h3>Caja N° {caja.numero}</h3>
      </Header>
      <CheckoutWizard />
    </>
  );
}

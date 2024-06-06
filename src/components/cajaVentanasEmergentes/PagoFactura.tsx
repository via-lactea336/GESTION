import { useState, useEffect } from "react";
import obtenerFacturasFiltro, { Filter } from "@/lib/moduloCaja/factura/obtenerFacturasFiltro";
import { Factura } from "@prisma/client";
import obtenerCliente from "@/lib/moduloCaja/cliente/obtenerCliente";
import LoadingCirleIcon from "../global/LoadingCirleIcon";
import Pagination from "../global/Pagination";
import { useRouter } from 'next/navigation';

interface PagoFacturaProps {
  idFactura: string;
}

const PagoFactura: React.FC<PagoFacturaProps> = ({ idFactura }) => {
  const router = useRouter();

  // Aquí puedes agregar el estado y los efectos necesarios para el componente de PagoFactura

  return (
    <div>
      <h1>Pago de Factura</h1>
      <p>ID de Factura: {idFactura}</p> 
      {/* Agrega aquí el contenido de tu componente de pago */}
    </div>
  );
};

export default PagoFactura;

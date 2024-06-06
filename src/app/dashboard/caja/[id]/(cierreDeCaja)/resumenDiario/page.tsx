"use client";
import Header from "@/components/global/Header";
import ResumenDeCaja from "@/components/dashboard/resumendiario/ResumenDeCaja";
import { obtenerRegistrosCaja } from "@/lib/moduloCaja/resumenDiario/obtenerRegistrosCaja";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { AperturaCaja, RegistroCaja } from "@prisma/client";
import { useEffect, useState } from "react";
import { obtenerMovimientos } from "@/lib/moduloCaja/movimiento/obtenerMovimientos";

export default function Page() {
  const apertura = obtenerCookie("apertura") as AperturaCaja
  const [registros, setRegistros] = useState<RegistroCaja>();


useEffect(() =>{
  const fetchRegistro = async() =>{
    try{
      const registros = await obtenerRegistrosCaja();
      if(!registros || typeof registros == "string") return;
      const registroActual = registros.data.filter(registro => registro.aperturaId ==apertura.id);
      setRegistros(registroActual[0])

      const movimientos = await obtenerMovimientos();
      if(!movimientos || typeof movimientos == "string") return;
      
    }catch(error){
      console.log(error)
    }
  }
  fetchRegistro();
}, [])

return (
  !registros? <div>Loading.....</div> : 
  <div className="flex flex-col h-full -mt-8">
    <Header title="Resumen diario" />
    <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md "> 
      <div className="flex justify-center gap-8" >
        <div className="w-full">
          <ResumenDeCaja
            {...registros}
          />
        </div>
      </div>
    </div>
  </div> 
);
}
"use client";
import Header from "@/components/global/Header";
import ResumenDeCaja from "@/components/dashboard/resumendiario/ResumenDeCaja";
import { obtenerRegistrosCaja } from "@/lib/moduloCaja/resumenDiario/obtenerRegistrosCaja";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { AperturaCaja, Movimiento, RegistroCaja } from "@prisma/client";
import { useEffect, useState } from "react";
import { obtenerMovimientos } from "@/lib/moduloCaja/movimiento/obtenerMovimientos";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumenCajaPDF from "@/components/PDF/ResumenDiario";
import { CajaData, Cajero } from "@/lib/definitions";

export default function Page() {
  const apertura = obtenerCookie("apertura") as AperturaCaja
  const caja = obtenerCookie("caja") as CajaData
  const cajero = obtenerCookie("cajero") as Cajero
  const [registros, setRegistros] = useState<RegistroCaja>();
  const [movimientos, setMovimientos] = useState<Movimiento[]>();
  const hardcodedData = {
    createdAt: new Date(),
    caja: { numero: 123 },
    cajero: { nombre: "Juan Pérez" },
    apertura: {
      saldoInicial: 1000000,
      createdAt: new Date(),
    },
    montoRegistrado: 2000000,
    montoIngreso: 1500000,
    montoIngresoCheque: 500000,
    montoIngresoTarjeta: 300000,
    movimientos: [
      {
        id: 1,
        esIngreso: true,
        monto: 500000,
        createdAt: new Date(),
      },
      {
        id: 2,
        esIngreso: false,
        monto: 200000,
        createdAt: new Date(),
      },
    ],
  };

  useEffect(() =>{
    const fetchRegistro = async() =>{
      try{
        const registros = await obtenerRegistrosCaja();
        if(!registros || typeof registros == "string") return;
        const registroActual = registros.data.filter(registro => registro.aperturaId ==apertura.id);
        setRegistros(registroActual[0])

        const movimientos = await obtenerMovimientos();
        if(!movimientos || typeof movimientos == "string") return;

        const movimientosRegistrados = movimientos.data.filter(movimiento => movimiento.aperturaId ==apertura.id);
        setMovimientos(movimientosRegistrados);
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
      <button className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        <PDFDownloadLink
          document={
            <ResumenCajaPDF
              createdAt={registros.createdAt}
              caja={Number(caja.numero)}
              cajero={cajero.nombre}
              apertura={{saldoInicial: Number(apertura.saldoInicial), createdAt: apertura.createdAt}}
              montoRegistrado={Number(registros.montoRegistrado)}
              montoIngreso={Number(registros.montoIngreso)}
              montoIngresoCheque={Number(registros.montoIngresoCheque)}
              montoIngresoTarjeta={Number(registros.montoIngresoTarjeta)}
              movimientos={movimientos? movimientos : []}
            />
          }
          fileName="ResumenCaja.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Generando PDF..." : "Descargar Resumen de Caja"
          }
        </PDFDownloadLink>
      </button>
      <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5"> 
        <div className="flex justify-center gap-8" >
          <div className="w-full">
            <ResumenDeCaja
              {...registros}
            />
          </div>
        </div>
      </div>
      <h1 className="mt-5 mb-5">Movimientos</h1>
      
      <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5">
        <table className="border-collapse border border-black table-auto mx-auto text-center w-full">
          <thead>
            <tr>
              <th className="p-2 w-1/5">Operacion</th>
              <th className="p-2 w-1/5">Monto</th>
              <th className="p-2 w-1/5">Fecha</th>
              <th className="p-2 w-1/5">Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 text-green-400">Apertura de caja</td>
              <td className="p-2">{Number(apertura.saldoInicial).toLocaleString()} Gs.</td>
              <td className="p-2">{new Date(apertura.createdAt).toLocaleDateString()}</td>
              <td className="p-2">
                {new Date(apertura.createdAt).getHours()}:
                {new Date(apertura.createdAt).getMinutes()}
              </td>
            </tr>
            {movimientos?.map((mov) => (
              <tr key={mov.id}>
                <td className={(mov.esIngreso)? "p-2 text-green-400" : "p-2 text-red-400"}>
                  {(mov.esIngreso)? "Ingreso" : "Egreso"}
                </td>
                <td className="p-2">{Number(mov.monto).toLocaleString()} Gs.</td>
                <td className="p-2">{new Date(mov.createdAt).toLocaleDateString()}</td>
                <td className="p-2">
                {new Date(mov.createdAt).getHours()}:
                {new Date(mov.createdAt).getMinutes()}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div> 
  );
}
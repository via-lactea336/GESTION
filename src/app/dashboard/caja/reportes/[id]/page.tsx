"use client";
import Header from "@/components/global/Header";
import ResumenDeCaja from "@/components/dashboard/resumendiario/ResumenDeCaja";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumenCajaPDF from "@/components/PDF/ResumenDiario";
import {
  CajaData,
  Cajero,
  RegistroDiarioFullData,
} from "@/lib/definitions";
import Link from "next/link";
import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import obtenerRegistroDeCajaPorAperturaId from "@/lib/moduloCaja/resumenDiario/obtenerRegistroDeCajaPorAperturaId";
import { useParams } from "next/navigation";
import { EyeIcon } from "@heroicons/react/16/solid";

export default function Page() {
  const { id } = useParams();
  const links = [
    { href: `/dashboard/caja`, text: "Inicio" },
    { href: `/dashboard/caja/reportes`, text: "Reportes" },
  ];
  const caja = obtenerCookie("caja") as CajaData;
  const cajero = obtenerCookie("cajero") as Cajero;
  const [registros, setRegistros] = useState<RegistroDiarioFullData>();

  useEffect(() => {
    const fetchRegistro = async () => {
      try {
        const registros = await obtenerRegistroDeCajaPorAperturaId(
          id as string
        );
        if (!registros || typeof registros == "string") return;
        console.log(registros);
        setRegistros(registros.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRegistro();
  }, [id]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? "0" + day : day}-${
      month < 10 ? "0" + month : month
    }-${year}`;
    return formattedDate;
  };
  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
    return formattedTime;
  };

  const changeValue = () => {

  }

  return !registros ? (
    <div className="flex justify-center items-center">
      <LoadingCirleIcon className="animate-spin h-8 w-8" />
    </div>
  ) : (
    <div>
      <Header title="Resumen diario" className="-mt-8">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="bg-gray-800 py-1 px-2 rounded-md hover:text-primary-100 hover:bg-gray-900 mx-2"
          >
            {link.text}
          </Link>
        ))}
        <PDFDownloadLink
          className="bg-gray-800 py-1 px-2 rounded-md hover:text-primary-100 hover:bg-gray-900 mx-2"
          document={
            <ResumenCajaPDF
              createdAt={registros.createdAt}
              caja={Number(caja.numero)}
              cajero={cajero.nombre}
              apertura={{
                saldoInicial: Number(registros.montoInicial),
                createdAt: registros.createdAt,
              }}
              montoRegistrado={Number(registros.montoRegistrado)}
              montoIngreso={Number(registros.montoIngresoEfectivo)}
              montoIngresoCheque={Number(registros.montoIngresoCheque)}
              montoIngresoTarjeta={Number(registros.montoIngresoTarjeta)}
              movimientos={registros.apertura.movimiento}
              observaciones={
                registros.apertura.observaciones
                  ? registros.apertura.observaciones
                  : "Sin observaciones durante el cierre"
              }
            />
          }
          fileName="ResumenCaja.pdf"
        >
          Descargar
        </PDFDownloadLink>
        <h3 className="ml-8">{cajero.nombre}</h3>
        <h3>Caja N° {caja.numero}</h3>
      </Header>

      <div className="bg-gray-800 py-4 px-4 rounded-md mt-5">
        <div className="w-full">
          <ResumenDeCaja {...registros} />
        </div>
      </div>
      <h2 className="my-5 font-semibold text-lg">Movimientos</h2>

      <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5">
        <table className="border-collapse table-auto mx-auto text-center w-full">
          <thead>
            <tr className="bg-gray-900 ">
              <th className="p-2 w-1/5 text-primary-300 font-normal">
                Operacion
              </th>
              <th className="p-2 w-1/5 text-primary-300 font-normal">Monto</th>
              <th className="p-2 w-1/5 text-primary-300 font-normal">Fecha</th>
              <th className="p-2 w-1/5 text-primary-300 font-normal">Hora</th>
              <th className="p-2 w-1/5 text-primary-300 font-normal">Detalles</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b-2 border-gray-700">
              <td className="p-2 text-green-400">Apertura de caja</td>
              <td className="p-2">
                {Number(registros.montoInicial).toLocaleString()} Gs.
              </td>
              <td className="p-2">
                {formatDate(registros.createdAt)}
              </td>
              <td className="p-2">
                {formatTime(registros.createdAt)}
              </td>
              <td>
                <button className="mt-4 mb-4">
                    {<EyeIcon className='w-6 h-6 ml-auto mr-auto'/>}
                  </button>
              </td>
            </tr>
            {registros.apertura.movimiento?.map((mov, i) => (
              <tr key={mov.id} className="border-b-2 border-gray-700">
                <td
                  className={
                    mov.esIngreso ? "p-2 text-green-400" : "p-2 text-red-400"
                  }
                >
                  {mov.esIngreso ? "Ingreso" : "Egreso"}
                </td>
                <td className="p-2">
                  {Number(mov.monto).toLocaleString()} Gs.
                </td>
                <td className="p-2">
                    {formatDate(mov.createdAt)}
                </td>
                <td className="p-2">
                  {formatTime(mov.createdAt)}
                </td>
                <td>
                  <button className="mt-4 mb-4">
                    {<EyeIcon className='w-6 h-6 ml-auto mr-auto'/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="my-5 font-semibold text-lg">Testing De componente para detalle operaciones</h2>
      {registros.apertura.movimiento[0].esIngreso? 



        <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5 flex flex-col">
          <div className="mb-5">
            <h1 className="text-center text-xl">Operacion de Ingreso</h1>
          </div>
          <div className="flex flex-row justify-between">
            <div className="ml-5">
              <h1 className="mb-2">Monto total de la operacion : {Number(registros.apertura.movimiento[0].monto).toLocaleString()} Gs.</h1>
              <h1 className="mb-2">Fecha: {formatDate(registros.apertura.movimiento[0].createdAt)}</h1>
              <h1 className="mb-2">Hora: {formatTime(registros.apertura.movimiento[0].createdAt)}</h1>
            </div>
            <div className="mr-20">
              <h1 className="mb-2">Detalles de Factura</h1>
              <h1 className="mb-2">Tipo de factura : {registros.apertura.movimiento[0].factura?.esContado? "Contado": "Credito"}</h1>
              <h1 className="mb-2">Numero de Factura : {registros.apertura.movimiento[0].factura?.numeroFactura}</h1>
              <h1 className="mb-2">Fecha de emision de la factura : {"  "}
                {registros.apertura.movimiento[0].factura?.createdAt?
                  formatDate(registros.apertura.movimiento[0].factura?.createdAt) : ""}</h1>
              <h1 className="mb-2">Monto total a pagar : {Number(registros.apertura.movimiento[0].factura?.total).toLocaleString()} Gs.</h1>
            </div>
          </div>
          <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5 flex flex-col">
            <h1 className="mb-2">Detalles Operacion</h1>
            {registros.apertura.movimiento[0].movimientoDetalles.map((detalle, index) =>(
              <div key={index} className="flex flex-row justify-between border-b border-white mt-5">
                <h1 className="mb-2">N°{index + 1}</h1>
                <h1 className="mb-2">Metodo de pago: {detalle.metodoPago}</h1>
                <h1 className="mb-2">Monto Parcial: {Number(detalle.monto)}</h1>
              </div>
            ))}
          </div>






        </div>:
        <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5 flex flex-col">
          <div className="mb-5">
            <h1 className="text-center text-xl">Operacion de Egreso</h1>
          </div>
          <div className="flex flex-row justify-around">
            <div>
              <h1 className="mb-2">Monto total de la operacion : {Number(registros.apertura.movimiento[0].monto).toLocaleString()} Gs.</h1>
              <h1 className="mb-2">Extraccion en efectivo</h1>
              <h1 className="mb-2">Fecha: {formatDate(registros.apertura.movimiento[0].createdAt)}</h1>
              <h1 className="mb-2">Hora: {formatTime(registros.apertura.movimiento[0].createdAt)}</h1>
            </div>
            <div>
              <h1 className="mb-2">Encargado: {"  "}
                {registros.apertura.movimiento[0].comprobantes[0].user.nombre}{"  "}
                {registros.apertura.movimiento[0].comprobantes[0].user.apellido}  
              </h1>
              <h1 className="mb-2">RUC: {registros.apertura.movimiento[0].comprobantes[0].user.docIdentidad}</h1>
              <h1 className="mb-2">Observaciones: {registros.apertura.observaciones}</h1>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

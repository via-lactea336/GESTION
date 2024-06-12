"use client";
import Header from "@/components/global/Header";
import ResumenDeCaja from "@/components/dashboard/resumendiario/ResumenDeCaja";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumenCajaPDF from "@/components/PDF/ResumenDiario";
import { CajaData, Cajero, DatosExtendidosRegistroCaja } from "@/lib/definitions";
import Link from "next/link";
import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import obtenerRegistroDeCajaPorAperturaId from "@/lib/moduloCaja/resumenDiario/obtenerRegistroDeCajaPorAperturaId";
import { useParams } from "next/navigation";

export default function Page() {
    const { id } = useParams();
    const links = [
        { href: `/dashboard/caja`, text: "Inicio" },
        { href: `/dashboard/caja/reportes`, text: "Reportes" },
    ];
    const caja = obtenerCookie("caja") as CajaData;
    const cajero = obtenerCookie("cajero") as Cajero;
    const [registros, setRegistros] = useState<DatosExtendidosRegistroCaja>();

    useEffect(() => {
        const fetchRegistro = async () => {
        try {
            console.log(id as string)
            const registros = await obtenerRegistroDeCajaPorAperturaId(id as string);
            if (!registros || typeof registros == "string") return;
            console.log(registros);
            setRegistros(registros.data);
        } catch (error) {
            console.log(error);
        }
        };
        fetchRegistro();
    }, []);

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
                    observaciones= {registros.apertura.observaciones?
                        registros.apertura.observaciones  :
                        "Sin observaciones durante el cierre"
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
                </tr>
            </thead>
            <tbody>
                <tr className="border-b-2 border-gray-700">
                <td className="p-2 text-green-400">Apertura de caja</td>
                <td className="p-2">
                    {Number(registros.montoInicial).toLocaleString()} Gs.
                </td>
                <td className="p-2">
                    {new Date(registros.createdAt)
                    .toISOString()
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                </td>
                <td className="p-2">
                    {new Date(registros.createdAt).getHours()}:{new Date(registros.createdAt).getMinutes()}
                </td>
                </tr>
                {registros.apertura.movimiento?.map((mov) => (
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
                    {new Date(mov.createdAt)
                        .toISOString()
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}
                    </td>
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

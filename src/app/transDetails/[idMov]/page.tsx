'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Page() {

    const [dateTime, setDateTime] = useState("");
    const [monto, setMonto] = useState("");
    const [numComprobante, setNumComprobante] = useState("");
    const [motivo, setMotivo] = useState("");
    const [concepto, setConcepto] = useState("");
    const [nombreDestino, setNombreDestino] = useState("");
    const [numCuentaDestino, setNumCuentaDestino] = useState("");
    const [bancoDestino, setBancoDestino] = useState("");
    const [nombreOrigen, setNombreOrigen] = useState("");
    const [numCuentaOrigen, setNumCuentaOrigen] = useState("");

    const { idMov } = useParams();

    const getTransferencia = async () => {
        try {
            const response = await fetch(`http://localhost:8000/pirate/${idMov}`);
            const result = await response.json();
            console.log(result);
            setDateTime(result.name);
            setMonto(result.pirate_catch_phrase);
            setNumComprobante(result.crew_position);
            setMotivo(result.number_of_treasures);
            setConcepto(result.peg_leg);
            setNombreDestino(result.eye_patch);
            setNumCuentaDestino(result.hook_hand);
            setBancoDestino(result.hook_hand);
            setNombreOrigen(result.hook_hand);
            setNumCuentaOrigen(result.hook_hand);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        //getTransferencia();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-1/2 px-4 pb-4 border-b border-gray-300">
                <h1 className="text-4xl font-bold pb-4">Comprobante de Transferencia</h1>
                <p className="text-lg">Fecha: {dateTime}</p>
            </div>
            <div className="w-1/2 px-4 pb-4 border-b border-gray-300">
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Monto:</p>
                    <p className="w-2/3 text-base">{monto}</p>
                </div>
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Comprobante:</p>
                    <p className="w-2/3 text-base">{numComprobante}</p>
                </div>
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Motivo:</p>
                    <p className="w-2/3 text-base">{motivo}</p>
                </div>
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Concepto:</p>
                    <p className="w-2/3 text-base">{concepto}</p>
                </div>
            </div>

            <div className="w-1/2 px-4 pb-4 border-b border-gray-300">
                <p className="text-lg">Destino</p>
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Nombre:</p>
                    <p className="w-2/3 text-base">{nombreDestino}</p>
                </div>
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Cuenta:</p>
                    <p className="w-2/3 text-base">{numCuentaDestino}</p>
                </div>
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Banco:</p>
                    <p className="w-2/3 text-base">{bancoDestino}</p>
                </div>
            </div>
            <div className="w-1/2 px-4 pb-4 border-b border-gray-300">
                <p className="text-lg">Origen</p>
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Nombre:</p>
                    <p className="w-2/3 text-base">{nombreOrigen}</p>
                </div>
                <div className="flex flex-row">
                    <p className="w-1/3 text-base">Cuenta:</p>
                    <p className="w-2/3 text-base">{numCuentaOrigen}</p>
                </div>
            </div>
        </div>
    );
}

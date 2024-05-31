"use client";
import Input from "@/components/global/Input";
import crearArqueo from "@/lib/arqueoCaja/crearArqueo";
import { ArqueoCajaData } from "@/lib/definitions";
import calcularMontoEsperado from "@/lib/moduloCaja/arqueoCaja/calcularMontoEsperado";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
    id: string;
    monto: number;
};

export default function FormArqueo({ id, monto }: Params) {
    const [exitoArqueo, setExitoArqueo] = useState(false);
    const router = useRouter();
    console.log(id + "    " + monto)
    const fetchCalculo = async () => {
        try {
            const arqueo: ArqueoCajaData = {
                aperturaId: id,
                montoRegistrado: monto
            }
            const montoApi = await crearArqueo(arqueo);
            if (montoApi === undefined || typeof montoApi === "string") {
                throw new Error("Error obteniendo las cuentas");
            }
            console.log(montoApi);
        } catch (error) {
            console.error(error);
        }
    };
    fetchCalculo();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        exitoArqueo? 
            <div>
                <h1 className="text-white text-center text-2xl">El Cierre de Caja Fue Exitoso</h1><br />
                <p className="text-white text-left">Fecha: 31-05-2024</p>
                <p className="text-white text-left">Hora: 14:46 {}</p>
                <p className="text-white text-left">Monto de cierre: 500.000 Gs.</p>
            </div> 
        :


        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
            <h1 className="text-center text-2xl">Hubo un error durante el cierre de caja</h1>
            <p className="text-sm text-center">Para continuar con el cierre ingrese la contraseña de autorizacion del gerente</p>
            <div className="flex justify-between items-center gap-4 mt-10">
                <div className="flex flex-col gap-2">
                    <label htmlFor="monto">Usuario</label>
                    <Input
                        className="block [max-width:250px] bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
                        id="monto"
                        type="text"
                        placeholder="Usuario Administrador"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="fecha">Contraseña</label>
                    <Input
                        className="block [max-width:250px] bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
                        id="monto"
                        type="text"
                        placeholder="contraseña"
                        required
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="observacion">Observación</label>
                <textarea
                id="observacion"
                name="observacion"
                placeholder="Observación"
                className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none [max-h-40] resize-none"
                />
            </div>
            <button
                type="submit"
                className="bg-primary-800 p-2 rounded-md text-white hover:bg-primary-700 transition-all duration-300 ease-in-out"
            >
                Finalizar Cierre
            </button>
        </form>
    );
}

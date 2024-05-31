"use client";
import Input from "@/components/global/Input";
import { useRouter } from "next/navigation";

type Params = {
    id: string;
    exitoArqueo: boolean;
};

export default function FormArqueo({ id, exitoArqueo }: Params) {
    const router = useRouter();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/dashboard/caja/1/resumenDiario`);
    };
    return (


        exitoArqueo? 
            <div>
                <h1 className="text-white text-center text-2xl">El Cierre de Caja Fue Exitoso</h1><br />
                <p className="text-white text-left">Numero de arqueo: 1234</p>
                <p className="text-white text-left">Fecha: 31-05-2024</p>
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
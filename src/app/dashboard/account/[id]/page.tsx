"use client";
import obtenerCuentaBancariaPorId from "@/lib/cuentaBancaria/obtenerCuentaBancariaPorId";
import obtenerOperaciones from "@/lib/operacion/obtenerOperaciones";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from 'react';


export default function AccountDetailsTab(){
    const [accountData, setAccountData] = useState({
        id: '',
        numeroCuenta: '',
        bancoId: '',
        entidadId: '',
        esCuentaAhorro: false,
        saldo: 0,
        saldoDisponible: 0,

    });
    const [operaciones, setOperaciones] = useState([{
        id: '',
        tipoOperacionId: '',
        fechaOperacion: new Date(),
        monto: 0,
        cuentaBancariaOrigenId: '',
        bancoInvolucrado: '',
        nombreInvolucrado: '',
        cuentaInvolucrado: '',
        rucInvolucrado: '',
        concepto: '',
        numeroComprobante: '',
    }]);
    const {id} = useParams();

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const cuentaReq = await obtenerCuentaBancariaPorId(id as string);
                if (!cuentaReq || typeof cuentaReq === 'string') {
                    throw new Error('Error obteniendo la cuenta');

                }
                setAccountData(cuentaReq.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchOperaciones = async () => {
            try {
                const operacionesReq = await obtenerOperaciones();
                if (operacionesReq === undefined) {
                    throw new Error('Error obteniendo las operaciones');
                }
                if (typeof operacionesReq === 'string') {
                    throw new Error(operacionesReq);
                }
                setOperaciones(operacionesReq.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAccount();
        fetchOperaciones();
    }, [id]); 


    const formatDate = (dateString: Date)  => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day < 10 ? "0" + day : day}-${month < 10 ? "0" + month : month}-${year}`;
        return formattedDate;
    };

    return (
        <div className="flex flex-col h-full -mt-8">
            {/* Encabezado con título y botón de retroceso */}
            <div className="flex justify-between items-center bg-primary-600 p-4 border-2 border-black">
                <h1 className="text-4xl font-bold mt-10 mb-10">Detalle cuentas</h1>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 -mt-20 rounded">
                Atrás
                </button>
            </div>

            {/* Contenido principal */}
            <div className="flex-grow bg-primary-200 shadow-md border-2 border-black pt-10 pb-10 pl-10 flex flex-row">
                {/* Datos de la cuenta */}
                <Image
                src="https://img.freepik.com/vector-gratis/hucha_53876-25494.jpg?size=338&ext=jpg&ga=GA1.1.1687694167.1714694400&semt=ais"
                alt="Account"
                width={20}
                height={20}
                className="w-20 h-20 object-cover mr-12 mt-10"
                />
                <div className="flex-1 mr-8 mt-12">
                    <div className="mb-4 flex items-center">
                        <label className="block text-gray-700 font-bold mr-2">
                        Tipo de Cuenta:
                        </label>
                        <p className="text-gray-700">{accountData.esCuentaAhorro? "Cuenta de ahorros" : "Cuenta Corriente"}</p>
                    </div>
                    <div className="mb-4 flex items-center">
                        <label className="block text-gray-700 font-bold mr-2">
                        Nombre de la Cuenta:
                        </label>
                        <p className="text-gray-700">{accountData.numeroCuenta}</p>
                    </div>
                </div>

                <div className="flex-1 mt-12">
                <div className="mb-4 flex items-center">
                    <label className="block text-gray-700 font-bold mr-2">
                    Saldo Disponible:
                    </label>
                    <p className="text-gray-700">
                    ${accountData.saldo.toFixed(2)}
                    </p>
                </div>
                <div className="flex items-center">
                    <label className="block text-gray-700 font-bold mr-2">
                    Saldo Retenido:
                    </label>
                    <p className="text-gray-700">
                    ${accountData.saldoDisponible.toFixed(2)}
                    </p>
                </div>
                </div>
            </div>
            <h1 className="text-3xl font-bold mt-10">Movimientos</h1>
            <div className="flex-grow bg-primary-200 shadow-md border-2 border-black p-10 flex flex-row">
                <table className="border-collapse w-full">
                    <tbody>
                        <tr>
                            <td className="w-1/4">
                                <h1 className="text-xl font-bold mt-1 text-black">Operacion</h1>
                            </td>
                            <td className="w-1/4">
                                <h1 className="text-xl font-bold mt-1 text-black">Fecha</h1>
                            </td >
                            <td className="w-1/4">
                                <h1 className="text-xl font-bold mt-1 text-black">
                                Descripcion
                                </h1>
                            </td>
                            <td className="w-1/4">
                                <h1 className="text-xl font-bold mt-1 text-black">
                                Monto Transaccion
                                </h1>
                            </td>
                        </tr>
                        {operaciones.map((operacion, index) => (
                        <tr key={index}>
                            <td>
                                <img
                                    src={operacion.tipoOperacionId === 'b30dde92-8757-4886-9388-be7dbc6cc275' ? 
                                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6lo6gclz5yoqrqK6NRz4qp5T2NDyBgcDfFx-IxBUTew&s' :
                                    'https://c1.klipartz.com/pngpicture/658/794/sticker-png-banking-arrow-money-bank-account-wire-transfer-electronic-funds-transfer-demand-deposit-mobile-banking-stanbic-ibtc-bank.png'
                                    }
                                    alt="Account"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-cover rounded-full bg-violet-400 mt-5 mb-5 ml-5"
                                />
                            </td>
                            <td>
                                <h1 className="text-base font-normal mt-1 text-black">
                                    {formatDate(operacion.fechaOperacion)}
                                </h1>
                            </td>
                            <td>
                                <h1 className="text-base font-normal mt-1 text-black">
                                    {operacion.concepto}
                                </h1>
                            </td>
                            <td>
                                <h1 className={`text-xl font-bold mt-1 ${operacion.tipoOperacionId === 'b30dde92-8757-4886-9388-be7dbc6cc275' ? 
                                    'text-green-500' : 'text-red-500'}`}>
                                    {operacion.monto >= 0 ? `+${operacion.monto.toFixed(2)}$` : `${operacion.monto.toFixed(2)}$`}
                                </h1>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

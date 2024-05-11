"use client";
import obtenerCuentaBancariaPorId from "@/lib/cuentaBancaria/obtenerCuentaBancariaPorId";
import obtenerOperaciones from "@/lib/operacion/obtenerOperaciones";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  WalletIcon,
  BanknotesIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import obtenerOperacionesPorCuentaId from "@/lib/operacion/obtenerOperacionesPorCuentaId";
import { OperacionAndTipoOperacion } from "@/lib/definitions";
import { CuentaBancaria } from "@prisma/client";
import Link from "next/link";
export default function AccountDetailsTab() {
  const [accountData, setAccountData] = useState<CuentaBancaria | null>(null);
  const [operaciones, setOperaciones] = useState<OperacionAndTipoOperacion[]>(
    []
  );
  const { id } = useParams();
  const router = useRouter();
  const handleNavigation = (path: string) => {
    return () => {
      router.push(path);
    };
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const cuentaReq = await obtenerCuentaBancariaPorId(id as string);
        if (!cuentaReq || typeof cuentaReq === "string") {
          throw new Error("Error obteniendo la cuenta");
        }
        setAccountData(cuentaReq.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchOperaciones = async () => {
      try {
        const operacionesReq = await obtenerOperacionesPorCuentaId(
          id as string
        );
        if (operacionesReq === undefined) {
          throw new Error("Error obteniendo las operaciones");
        }
        if (typeof operacionesReq === "string") {
          throw new Error(operacionesReq);
        }
        setOperaciones(operacionesReq.data);
        console.log(operacionesReq.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccount();
    fetchOperaciones();
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

  if (accountData === null || operaciones === null) {
    return <h1>cargando....</h1>;
  } else {
    return (
      <div className="flex flex-col h-full -mt-8">
        {/* Encabezado con título y botón de retroceso */}
        <div className="flex justify-between items-center bg-primary-800 p-4 rounded-md">
          <h1 className="text-2xl font-bold mt-2 mb-2">Detalle cuentas</h1>
          <Link
            href="/dashboard/account"
            className="bg-gray-800 hover:bg-gray-900 text-white  py-2 px-4 rounded"
          >
            Atrás
          </Link>
        </div>

        {/* Contenido principal */}
        <div className="bg-gray-800 rounded-md  py-5 mt-2 flex gap-2 justify-around flex-wrap">
          <div className="w-20 h-20 mt-2">
            {accountData.esCuentaAhorro ? (
              <BanknotesIcon className="text-primary-400" />
            ) : (
              <WalletIcon className="text-primary-400" />
            )}
          </div>
          <div className="mt-5">
            <div className="mb-4 flex items-center">
              <label className="block  font-semibold mr-2">
                Tipo de Cuenta:
              </label>
              <p>
                {accountData.esCuentaAhorro
                  ? "Cuenta de ahorros"
                  : "Cuenta Corriente"}
              </p>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block font-semibold mr-2">
                Numero de Cuenta:
              </label>
              <p>{accountData.numeroCuenta}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-4 flex items-center">
              <label className="block font-semibold mr-2">
                Saldo Disponible:
              </label>
              <p>${Number(accountData.saldo).toLocaleString()}</p>
            </div>
            <div className="flex items-center">
              <label className="block font-semibold mr-2">
                Saldo Retenido:
              </label>
              <p>${Number(accountData.saldoDisponible).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <h1 className="text-xl font-bold my-4">Movimientos</h1>
        <div className="flex-grow bg-gray-800 rounded-md p-5 flex flex-row">
          <table className="border-collapse w-full">
            <tbody>
              <tr>
                <td className="w-1/6">
                  <span className="text-md mt-1 text-primary-400">
                    Operacion
                  </span>
                </td>
                <td className="w-1/6">
                  <span className="text-md mt-1 text-primary-400">Fecha</span>
                </td>
                <td className="w-1/6">
                  <span className="text-md mt-1 text-primary-400">
                    Banco Origen
                  </span>
                </td>
                <td className="w-1/6">
                  <span className="text-md mt-1 text-primary-400">
                    Involucrado
                  </span>
                </td>
                <td className="w-1/6">
                  <span className="text-md mt-1 text-primary-400">
                    Concepto
                  </span>
                </td>
                <td className="w-1/6">
                  <span className="text-md mt-1 text-primary-400">Monto</span>
                </td>
              </tr>
              {operaciones.map((operacion, index) => (
                <tr
                  key={index}
                  onClick={handleNavigation(
                    `/dashboard/account/${id}/${operacion.id}`
                  )}
                  className="border-b-2 border-b-gray-700 w-full hover:bg-gray-700 hover:cursor-pointer"
                  title="Ver detalles de la operación"
                >
                  <td className="py-2">
                    <div className="w-7 h-7 ml-5">
                      {operacion.tipoOperacion ? (
                        <ArrowUpRightIcon className="text-red-500" />
                      ) : (
                        <ArrowDownLeftIcon className="text-green-500" />
                      )}
                    </div>
                  </td>
                  <td>
                    <h1 className="text-sm font-normal mt-1">
                      {formatDate(operacion.fechaOperacion)}
                    </h1>
                  </td>
                  <td>
                    <h1 className="text-sm font-normal mt-1">
                      {operacion.bancoInvolucrado}
                    </h1>
                  </td>
                  <td>
                    <h1 className="text-sm font-normal mt-1 ">
                      {operacion.nombreInvolucrado}
                    </h1>
                  </td>
                  <td>
                    <h1 className="text-sm font-normal mt-1 ">
                      {operacion.concepto}
                    </h1>
                  </td>
                  <td>
                    <span
                      className={`text-sm mt-1 ${
                        operacion.tipoOperacionId
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {Number(operacion.monto) >= 0
                        ? `- ${Number(operacion.monto).toLocaleString()} Gs.`
                        : `+ ${Number(operacion.monto).toLocaleString()} Gs.`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

"use client";

import DetalleCuentaReceipt from "@/components/PDF/DetalleCuentas";
import InputCalendar from "@/components/global/InputCalendar";
import {
  CuentaBancariaAndBanco,
  OperacionAndTipoOperacion,
  ApiResponseData,
} from "@/lib/definitions";
import obtenerBancos from "@/lib/moduloBanco/banco/obtenerBancos";
import obtenerCuentaBancaria from "@/lib/moduloBanco/cuentaBancaria/obtenerCuentaBancaria";
import obtenerTiposOperacion from "@/lib/moduloBanco/tipoOperacion/obtenerTiposOperacion";
import {
  BanknotesIcon,
  WalletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import Tabla from "./Tabla";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Input from "@/components/global/Input";
import { useDebouncedCallback } from "use-debounce";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <></>,
  }
);

type DataProps = {
  userName: string;
};

export default function Data({ userName }: DataProps) {
  const user = {
    name: userName,
  };
  Cookies.set("user", JSON.stringify(user));
  const quantityPerPage = parseInt(process.env.QUANTITY_PER_PAGE || "8");
  const [indicesPagina, setindicesPagina] = useState(0);
  const [indiceActual, setIndiceActual] = useState(0);
  const [accountData, setAccountData] = useState<CuentaBancariaAndBanco | null>(
    null
  );
  const [operaciones, setOperaciones] = useState<OperacionAndTipoOperacion[]>(
    []
  );

  const [tipoOperaciones, setTipoOperaciones] = useState<
    ApiResponseData<
      {
        id: string;
        nombre: string;
        esDebito: boolean | null;
        afectaSaldo: boolean;
        deleted: Date | null;
      }[]
    >
  >();

  const [filtros, setFiltros] = useState({
    tipoOperacionId: "",
    fechaMin: "",
    fechaMax: "",
    banco: "",
    esDebito: undefined,
    pagina: 0,
  });
  const [numeroComprobante, setNumeroComprobante] = useState("");

  const { id } = useParams();
  const router = useRouter();
  const handleNavigation = (path: string) => {
    console.log("click");

    router.push(path);
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const bancos = await obtenerCuentaBancaria();
        if (bancos === undefined || typeof bancos === "string") {
          throw new Error("Error obteniendo las cuentas");
        }
        const cuenta = bancos.data.find((cuenta) => cuenta.id === id);
        if (!cuenta) {
          throw new Error("Cuenta no encontrada");
        }

        setAccountData(cuenta);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTiposOperaciones = async () => {
      try {
        const tipoOperacionesReq = await obtenerTiposOperacion();
        if (tipoOperacionesReq === undefined) {
          throw new Error("Error obteniendo las operaciones");
        }
        if (typeof tipoOperacionesReq === "string" || !tipoOperacionesReq) {
          throw new Error(tipoOperacionesReq);
        }
        setTipoOperaciones(tipoOperacionesReq);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchBancos = async () => {
      try {
        const tipoOperacionesReq = await obtenerBancos();
        if (tipoOperacionesReq === undefined) {
          throw new Error("Error obteniendo las operaciones");
        }
        if (typeof tipoOperacionesReq === "string" || !tipoOperacionesReq) {
          throw new Error(tipoOperacionesReq);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccount();
    fetchTiposOperaciones();
    fetchBancos();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value,
    });
  };

  const handelNumeroComprobanteChange = useDebouncedCallback(
    (value: string) => {
      setNumeroComprobante(value);
    },
    300
  );

  const changeIndicePagina = async (indice: number) => {
    setIndiceActual(indice);
    setFiltros({
      ...filtros,
      pagina: indice * quantityPerPage,
    });
  };

  return (
    <div className="flex flex-col h-full -mt-8">
      {/* Encabezado con título y botón de retroceso */}
      <div className="flex justify-between items-center bg-primary-800 p-4 rounded-md">
        <h1 className="text-2xl font-bold mt-2 mb-2">Detalle cuentas</h1>
        <div>
          <Link
            className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-900 mr-4"
            href={`/dashboard/account/${id}/cheque`}
          >
            Ver Cheques
          </Link>
          <PDFDownloadLink
            className="mr-4 bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md"
            document={
              accountData ? (
                <DetalleCuentaReceipt
                  operaciones={operaciones}
                  cuenta={accountData}
                  userName={userName}
                />
              ) : (
                <div></div>
              )
            }
            fileName="detalle-cuentas.pdf"
          >
            {({ loading, url, error, blob }) => (
              <button
                className={loading ? `cursor-not-allowed` : `cursor-pointer`}
              >
                Descargar
              </button>
            )}
          </PDFDownloadLink>

          <Link
            href={`/dashboard/account/${id}/transacciones`}
            className="bg-gray-800 hover:bg-gray-900 text-white mr-4 py-2 px-4 rounded"
          >
            Transacción
          </Link>

          <Link
            href="/dashboard/account"
            className="bg-gray-800 hover:bg-gray-900 text-white  py-2 px-4 rounded"
          >
            Atrás
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-gray-800 rounded-md  py-5 mt-2 flex gap-2 justify-around flex-wrap">
        {accountData ? (
          <div className="w-20 h-20 mt-2">
            {accountData.esCuentaAhorro ? (
              <BanknotesIcon className="text-primary-400" />
            ) : (
              <WalletIcon className="text-primary-400" />
            )}
          </div>
        ) : (
          <div className="w-20 h-20 mt2 bg-gray-300 rounded-md animate-pulse"></div>
        )}
        <div className="mt-5">
          <div className="mb-4 flex items-center">
            <label className="block  font-semibold mr-2">Tipo de Cuenta:</label>
            {accountData ? (
              <p>
                {accountData.esCuentaAhorro
                  ? "Cuenta de Ahorro"
                  : "Cuenta Corriente"}
              </p>
            ) : (
              <div className="bg-gray-300 h-4 w-20 rounded animate-pulse"></div>
            )}
          </div>
          <div className="mb-4 flex items-center">
            <label className="block font-semibold mr-2">Cuenta:</label>
            {accountData ? (
              <p>
                {accountData.banco.nombre} {accountData.numeroCuenta}
              </p>
            ) : (
              <div className="bg-gray-300 h-4 w-20 rounded animate-pulse"></div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-4 flex items-center">
            <label className="block font-semibold mr-2">Saldo Total:</label>
            {accountData ? (
              <p>{Number(accountData.saldo).toLocaleString()} Gs.</p>
            ) : (
              <div className="bg-gray-300 h-4 w-20 rounded animate-pulse"></div>
            )}
          </div>
          <div className="flex items-center">
            <label className="block font-semibold mr-2">
              Saldo Disponible:
            </label>
            {accountData ? (
              <p>{Number(accountData.saldoDisponible).toLocaleString()} Gs.</p>
            ) : (
              <div className="bg-gray-300 h-4 w-20 rounded animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
      <h1 className="text-xl font-bold my-4">Movimientos</h1>

      <div className="flex justify-around items-center gap-3 mb-1 bg-primary-800 p-4 rounded-md">
        <div className="flex flex-col gap-2">
          <label className="mr-1">Operacion</label>
          <select
            className="bg-gray-800 text-white py-1 px-2 rounded-md mr-3 
              [width:180px]"
            name="tipoOperacionId"
            onChange={handleChange}
          >
            <option value="">Todas</option>
            {tipoOperaciones?.data.map((option, i) => (
              <option key={i} value={option.id}>
                {option.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="mr-1">Movimiento</label>
          <select
            className="bg-gray-800 text-white py-1 px-2 rounded mr-3 w-28"
            name="esDebito"
            onChange={handleChange}
          >
            <option value="">Todas</option>
            <option value="true">Débito</option>
            <option value="false">Crédito</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="mr-2 mt-1">Fecha desde</label>
          <InputCalendar
            id="fechaMin"
            value={filtros.fechaMin}
            limit={filtros.fechaMax ? new Date(filtros.fechaMax) : new Date()}
            handleChange={handleChange}
            className="bg-gray-800 text-white py-1 px-2 rounded-md mr-3"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="mr-2 mt-1">Fecha hasta</label>
          <InputCalendar
            id="fechaMax"
            value={filtros.fechaMax}
            handleChange={handleChange}
            min={filtros.fechaMin}
            className="bg-gray-800 text-white py-1 px-2 rounded-md mr-3"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="mr-2 mt-1">N° Comprobante</label>
          <Input
            id="numeroComprobante"
            onChange={(e) => {
              handelNumeroComprobanteChange(e.target.value);
            }}
            type="text"
            placeholder="Ingrese el n° de comprobante"
            className="bg-gray-800 text-white py-1 px-2 rounded-md mr-3"
          />
        </div>
      </div>
      <Toaster richColors />
      <div className="flex-grow bg-gray-800 rounded-md p-5 flex flex-row">
        <Tabla
          filtros={filtros}
          numeroComprobante={numeroComprobante}
          handleNavigation={handleNavigation}
          setOperaciones={setOperaciones}
          setindicesPagina={setindicesPagina}
        />
      </div>
      <div className="flex justify-around items-center mt-2 ">
        <button
          onClick={async () => await changeIndicePagina(indiceActual - 1)}
          disabled={indiceActual - 1 === -1}
          className="w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 rounded"
        >
          <ChevronLeftIcon />
        </button>
        <div className="gap-2 flex">
          {[...Array(indicesPagina)].map((_, index) => (
            <button
              key={index}
              onClick={async () => await changeIndicePagina(index)}
              className={
                (index === indiceActual
                  ? "opacity-50 cursor-not-allowed "
                  : "hover:bg-gray-900 ") + "px-6 py-2 bg-gray-700 rounded"
              }
            >
              <span className={"cursor-pointer m-auto"}>{index + 1}</span>
            </button>
          ))}
        </div>
        <button
          onClick={async () => await changeIndicePagina(indiceActual + 1)}
          disabled={indiceActual + 1 === indicesPagina}
          className={
            "w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 rounded"
          }
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

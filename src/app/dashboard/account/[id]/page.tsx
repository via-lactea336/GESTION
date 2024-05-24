"use client";
import obtenerCuentaBancariaPorId from "@/lib/cuentaBancaria/obtenerCuentaBancariaPorId";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DetalleCuentasReceipt from "../../../../components/PDF/DetalleCuentas";
import obtenerOperacionesFiltros from "@/lib/operacion/obtenerOperacionesFiltros";
import { ApiResponseData, OperacionAndTipoOperacion } from "@/lib/definitions";
import obtenerTiposOperacion from "@/lib/tipoOperacion/obtenerTiposOperacion";
import { CuentaBancaria } from "@prisma/client";
import Link from "next/link";
import {
  WalletIcon,
  BanknotesIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { PDFDownloadLink } from "@react-pdf/renderer";
import obtenerBancos from "@/lib/banco/obtenerBancos";
import InputCalendar from "@/components/global/InputCalendar";
import { Toaster, toast } from "sonner";
import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import Tabla from "@/components/dashboard/account/detalles/Tabla";
export default function AccountDetailsTab() {
  const quantityPerPage = parseInt(process.env.QUANTITY_PER_PAGE || "8");
  const [indicesPagina, setindicesPagina] = useState(0);
  const [indiceActual, setIndiceActual] = useState(0);
  const [accountData, setAccountData] = useState<CuentaBancaria | null>(null);
  const [operaciones, setOperaciones] = useState<OperacionAndTipoOperacion[]>(
    []
  );
  const [bancos, setBancos] = useState<
    ApiResponseData<
      {
        id: string;
        nombre: string;
        deleted: Date | null;
      }[]
    >
  >();
  const [operacionesFiltradas, setOperacionesFiltradas] = useState<
    OperacionAndTipoOperacion[]
  >([]);
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
        setBancos(tipoOperacionesReq);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccount();
    fetchTiposOperaciones();
    fetchBancos();
  }, [id]);

  const fetchOperaciones = useCallback(async () => {
    try {
      // Validar que la fecha mínima no sea mayor a la fecha máxima
      if (new Date(filtros.fechaMin) > new Date(filtros.fechaMax)) {
        toast.error("La fecha desde no puede ser mayor a la fecha hasta");
        return;
      }
      const operacionesReq = await obtenerOperacionesFiltros({
        cuentaId: id as string,
        fechaDesde: filtros.fechaMin,
        fechaHasta: filtros.fechaMax,
        skip: filtros.pagina,
        upTo: quantityPerPage,
        esDebito: filtros.esDebito,
        banco: filtros.banco,
        tipoOperacionId: filtros.tipoOperacionId,
      });
      console.log(operacionesReq);

      if (typeof operacionesReq === "string") {
        throw new Error(operacionesReq);
      }

      if (!operacionesReq || !operacionesReq.data) {
        throw new Error("Error obteniendo las operaciones");
      }

      setOperaciones(operacionesReq.data.values);
      setOperacionesFiltradas(operacionesReq.data.values);
      setindicesPagina(
        operacionesReq.data.totalQuantity % quantityPerPage === 0
          ? operacionesReq.data.totalQuantity / quantityPerPage
          : Math.floor(operacionesReq.data.totalQuantity / quantityPerPage) + 1
      );
    } catch (error) {
      console.error(error);
    }
  }, [id, filtros, quantityPerPage]);

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
                <DetalleCuentasReceipt
                  operaciones={operaciones}
                  cuenta={accountData}
                  //concepto={concepto}
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
            <label className="block font-semibold mr-2">
              Numero de Cuenta:
            </label>
            {accountData ? (
              <p>{accountData.numeroCuenta}</p>
            ) : (
              <div className="bg-gray-300 h-4 w-20 rounded animate-pulse"></div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-4 flex items-center">
            <label className="block font-semibold mr-2">Saldo Total:</label>
            {accountData ? (
              <p>${Number(accountData.saldo).toLocaleString()}</p>
            ) : (
              <div className="bg-gray-300 h-4 w-20 rounded animate-pulse"></div>
            )}
          </div>
          <div className="flex items-center">
            <label className="block font-semibold mr-2">
              Saldo Disponible:
            </label>
            {accountData ? (
              <p>${Number(accountData.saldoDisponible).toLocaleString()}</p>
            ) : (
              <div className="bg-gray-300 h-4 w-20 rounded animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
      <h1 className="text-xl font-bold my-4">Movimientos</h1>

      <div className="flex justify-around gap-3 mb-1 bg-primary-800 p-4 rounded-md">
        <div>
          <label>Tipo Operacion</label>
          <select
            className="bg-gray-800 text-white py-1 px-2 rounded-md mr-3 
              [width:200px]"
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

        <div>
          <label>Operacion</label>
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

        <div>
          <label>Banco</label>
          <select
            className="bg-gray-800 text-white py-1 px-2 rounded mr-3 [width:200px]"
            name="banco"
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {bancos?.data.map((option, i) => (
              <option key={i} value={option.nombre}>
                {option.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Fecha desde</label>
          <InputCalendar
            id="fechaMin"
            value={filtros.fechaMin}
            handleChange={handleChange}
            className="bg-gray-800 text-white py-1 px-2 rounded-md mr-3"
          />
        </div>

        <div>
          <label>Fecha hasta</label>
          <InputCalendar
            id="fechaMax"
            value={filtros.fechaMax}
            handleChange={handleChange}
            className="bg-gray-800 text-white py-1 px-2 rounded-md mr-3"
          />
        </div>
      </div>
      <Toaster richColors />
      <div className="flex-grow bg-gray-800 rounded-md p-5 flex flex-row">
        <Tabla
          filtros={filtros}
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

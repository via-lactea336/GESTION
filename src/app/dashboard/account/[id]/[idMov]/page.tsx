"use client";
import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import obtenerOperacionPorId from "../../../../../lib/moduloBanco/operacion/obtenerOperacionPorId";
import TransferReceipt from "../../../../../components/PDF/TransferenciaDetails";
import { PDFDownloadLink } from "@react-pdf/renderer";
import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import { useSession } from "next-auth/react";
import Retiro from "@/components/dashboard/account/TransferenciaDetalles/Retiro";
import Deposito from "@/components/dashboard/account/TransferenciaDetalles/Deposito";
import DebitoBancario from "@/components/dashboard/account/TransferenciaDetalles/DebitoBancario";
import Transferencia from "@/components/dashboard/account/TransferenciaDetalles/Transferencia";
import EmitirCheque from "@/components/dashboard/account/TransferenciaDetalles/EmitirCheque";
import DebitoBancarioPDF from "@/components/dashboard/account/TransferenciaDetalles/pdf/DebitoBancarioPDF";
import DepositoPDF from "@/components/dashboard/account/TransferenciaDetalles/pdf/DepositoPDF";
import EmitirChequePDF from "@/components/dashboard/account/TransferenciaDetalles/pdf/EmitirChequePDF";
import RetiroPDF from "@/components/dashboard/account/TransferenciaDetalles/pdf/RetiroPDF";

export default function PageComponent() {
  const [dateTime, setDateTime] = useState("undefined");
  const [monto, setMonto] = useState("0");
  const [numComprobante, setNumComprobante] = useState("undefined");
  const [concepto, setConcepto] = useState("undefined");
  const [nombreDestino, setNombreDestino] = useState("undefined");
  const [numCuentaDestino, setNumCuentaDestino] = useState<string | null>(
    "undefined"
  );
  const [bancoDestino, setBancoDestino] = useState<string | null>("undefined");
  const [nombreOrigen, setNombreOrigen] = useState("undefined");
  const [numCuentaOrigen, setNumCuentaOrigen] = useState("undefined");
  const [bancoOrigen, setBancoOrigen] = useState("undefined");
  const [tipoOperacion, setTipoOperacion] = useState("undefined");
  const [tipoOperacionNombre, setTipoOperacionNombre] = useState("undefined");
  const [ruc, setRuc] = useState<string | null>("undefined");
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  const user = session?.user;

  const { idMov } = useParams();
  const router = useRouter();

  const getTransferencia = async () => {
    const data = await obtenerOperacionPorId(idMov as string);
    if (
      data == undefined ||
      typeof data === "string" ||
      data.success === false
    ) {
      router.push("not-found");
      return;
    }

    const fechaHora = new Date(data.data.fechaOperacion);
    const formattedDateTime = fechaHora.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setDateTime(formattedDateTime);
    const formattedMonto = data.data.monto.toLocaleString();
    setMonto(formattedMonto);
    setNumComprobante(data.data.numeroComprobante);
    setConcepto(data.data.concepto);
    setNombreDestino(data.data.nombreInvolucrado);
    setNumCuentaDestino(data.data.cuentaInvolucrado);
    setBancoDestino(data.data.bancoInvolucrado);
    setNombreOrigen(data.data.cuentaBancariaOrigen.entidad.nombre);
    setNumCuentaOrigen(data.data.cuentaBancariaOrigen.numeroCuenta);
    setBancoOrigen(data.data.cuentaBancariaOrigen.banco.nombre);
    setTipoOperacion(data.data.tipoOperacion.esDebito ? "Debito" : "Credito");
    setTipoOperacionNombre(data.data.tipoOperacion.nombre);
    setRuc(data.data.rucInvolucrado);
    setLoading(false);
  };

  useEffect(() => {
    getTransferencia();
    console.log(tipoOperacionNombre);
  });

  const handleCloseButtonClick = () => {
    router.back();
  };
  if (!user || loading)
    return (
      <div className="grid place-items-center h-full">
        <LoadingCirleIcon className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {tipoOperacionNombre == "Retiro" ? (
        <Retiro
          tipoOperacion={tipoOperacion}
          tipoOperacionNombre={tipoOperacionNombre}
          dateTime={dateTime}
          monto={monto}
          numComprobante={numComprobante}
          concepto={concepto}
          nombreDestino={nombreDestino}
          numCuentaDestino={numCuentaDestino ? numCuentaDestino : ""}
          bancoDestino={bancoDestino ? bancoDestino : ""}
          nombreOrigen={nombreOrigen}
          numCuentaOrigen={numCuentaOrigen}
          bancoOrigen={bancoOrigen}
          ruc={ruc}
        />
      ) : null}

      {tipoOperacionNombre == "Depósito" ? (
        <Deposito
          tipoOperacion={tipoOperacion}
          tipoOperacionNombre={tipoOperacionNombre}
          dateTime={dateTime}
          monto={monto}
          numComprobante={numComprobante}
          concepto={concepto}
          nombreDestino={nombreDestino}
          numCuentaDestino={numCuentaDestino ? numCuentaDestino : ""}
          bancoDestino={bancoDestino ? bancoDestino : ""}
          nombreOrigen={nombreOrigen}
          numCuentaOrigen={numCuentaOrigen}
          bancoOrigen={bancoOrigen}
          ruc={ruc}
        />
      ) : null}

      {tipoOperacionNombre == "Débito bancario" ? (
        <DebitoBancario
          tipoOperacion={tipoOperacion}
          tipoOperacionNombre={tipoOperacionNombre}
          dateTime={dateTime}
          monto={monto}
          numComprobante={numComprobante}
          concepto={concepto}
          nombreDestino={nombreDestino}
          numCuentaDestino={numCuentaDestino ? numCuentaDestino : ""}
          bancoDestino={bancoDestino ? bancoDestino : ""}
          nombreOrigen={nombreOrigen}
          numCuentaOrigen={numCuentaOrigen}
          bancoOrigen={bancoOrigen}
        />
      ) : null}

      {tipoOperacionNombre == "Transferencia (Emitida)" ||
      tipoOperacionNombre == "Transferencia (Recibida)" ? (
        <Transferencia
          tipoOperacion={tipoOperacion}
          tipoOperacionNombre={tipoOperacionNombre}
          dateTime={dateTime}
          monto={monto}
          numComprobante={numComprobante}
          concepto={concepto}
          nombreDestino={nombreDestino}
          numCuentaDestino={numCuentaDestino ? numCuentaDestino : ""}
          bancoDestino={bancoDestino ? bancoDestino : ""}
          nombreOrigen={nombreOrigen}
          numCuentaOrigen={numCuentaOrigen}
          bancoOrigen={bancoOrigen}
        />
      ) : null}

      {tipoOperacionNombre == "Emitir Cheque" ? (
        <EmitirCheque
          tipoOperacion={tipoOperacion}
          tipoOperacionNombre={tipoOperacionNombre}
          dateTime={dateTime}
          monto={monto}
          numComprobante={numComprobante}
          concepto={concepto}
          nombreDestino={nombreDestino}
          numCuentaDestino={numCuentaDestino ? numCuentaDestino : ""}
          bancoDestino={bancoDestino ? bancoDestino : ""}
          nombreOrigen={nombreOrigen}
          numCuentaOrigen={numCuentaOrigen}
          bancoOrigen={bancoOrigen}
        />
      ) : null}

      <div className="w-1/2 py-4 border-gray-300">
        <div className="flex flex-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="blue"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-badge-info"
          >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <line x1="12" x2="12" y1="16" y2="12" />
            <line x1="12" x2="12.01" y1="8" y2="8" />
          </svg>
          <p className="pb-4 px-2">No válido como comprobante legal</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleCloseButtonClick}
            className=" mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar
          </button>
          <button
            className={
              "mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            }
          >
            <PDFDownloadLink
              document={
                tipoOperacionNombre === "Débito bancario" ? (
                  <DebitoBancarioPDF
                    numComprobante={numComprobante}
                    concepto={concepto}
                    nombreDestino={nombreDestino}
                    numCuentaDestino={numCuentaDestino || ""}
                    bancoDestino={bancoDestino || ""}
                    nombreOrigen={nombreOrigen}
                    numCuentaOrigen={numCuentaOrigen}
                    tipoOperacion={tipoOperacionNombre}
                    monto={monto}
                    dateTime={dateTime}
                    bancoOrigen={bancoOrigen}
                    userName={`${user?.nombre}`}
                  />
                ) : tipoOperacionNombre === "Depósito" ? (
                  <DepositoPDF
                    numComprobante={numComprobante}
                    concepto={concepto}
                    nombreDestino={nombreDestino}
                    numCuentaDestino={numCuentaDestino || ""}
                    bancoDestino={bancoDestino || ""}
                    nombreOrigen={nombreOrigen}
                    numCuentaOrigen={numCuentaOrigen}
                    tipoOperacion={tipoOperacionNombre}
                    monto={monto}
                    dateTime={dateTime}
                    bancoOrigen={bancoOrigen}
                    userName={`${user?.nombre}`}
                    ruc={ruc}
                  />
                ) : tipoOperacionNombre === "Emitir Cheque" ? (
                  <EmitirChequePDF
                    numComprobante={numComprobante}
                    concepto={concepto}
                    nombreDestino={nombreDestino}
                    numCuentaDestino={numCuentaDestino || ""}
                    bancoDestino={bancoDestino || ""}
                    nombreOrigen={nombreOrigen}
                    numCuentaOrigen={numCuentaOrigen}
                    tipoOperacion={tipoOperacionNombre}
                    monto={monto}
                    dateTime={dateTime}
                    bancoOrigen={bancoOrigen}
                    userName={`${user?.nombre}`}
                  />
                ) : tipoOperacionNombre === "Retiro" ? (
                  <RetiroPDF
                    numComprobante={numComprobante}
                    concepto={concepto}
                    nombreDestino={nombreDestino}
                    numCuentaDestino={numCuentaDestino || ""}
                    bancoDestino={bancoDestino || ""}
                    nombreOrigen={nombreOrigen}
                    numCuentaOrigen={numCuentaOrigen}
                    tipoOperacion={tipoOperacionNombre}
                    monto={monto}
                    dateTime={dateTime}
                    bancoOrigen={bancoOrigen}
                    userName={`${user?.nombre}`}
                    ruc={ruc}
                  />
                ) : tipoOperacionNombre.startsWith("Transferencia") ? (
                  <TransferReceipt
                    numComprobante={numComprobante}
                    concepto={concepto}
                    nombreDestino={nombreDestino}
                    numCuentaDestino={numCuentaDestino || ""}
                    bancoDestino={bancoDestino || ""}
                    nombreOrigen={nombreOrigen}
                    numCuentaOrigen={numCuentaOrigen}
                    tipoOperacion={tipoOperacion}
                    monto={monto}
                    dateTime={dateTime}
                    bancoOrigen={bancoOrigen}
                    userName={`${user?.nombre}`}
                  />
                ) : (
                  <></>
                )
              }
              fileName={`Operación_${numComprobante}.pdf`}
            >
              {({ loading, url, error, blob }) =>
                loading ? <p> Cargando documento... </p> : <p>Descargar</p>
              }
            </PDFDownloadLink>
          </button>
        </div>
      </div>
    </div>
  );
}

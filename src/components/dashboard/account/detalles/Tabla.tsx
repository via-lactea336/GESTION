import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import { OperacionAndTipoOperacion } from "@/lib/definitions";
import obtenerOperacionesFiltros from "@/lib/moduloBanco/operacion/obtenerOperacionesFiltros";
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type TablaProps = {
  handleNavigation: (path: string) => () => void;
  numeroComprobante:string;
  setindicesPagina: (pagina: number) => void;
  setOperaciones: (operaciones: OperacionAndTipoOperacion[]) => void;
  filtros: {
    tipoOperacionId: string;
    fechaMin: string;
    fechaMax: string;
    banco: string;
    esDebito: boolean | undefined;
    pagina: number;
  };
};

export default function Tabla({
  handleNavigation,
  setindicesPagina,
  setOperaciones,
  filtros,
  numeroComprobante
}: TablaProps) {
  const quantityPerPage = parseInt(process.env.QUANTITY_PER_PAGE || "8");

  const [operacionesFiltradas, setOperacionesFiltradas] = useState<
    OperacionAndTipoOperacion[]
  >([]);

  const [loading, setLoading] = useState(false);

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

  const { id } = useParams();

  const fetchOperaciones = useCallback(async () => {
    try {
      // Validar que la fecha mínima no sea mayor a la fecha máxima
      if (
        (filtros.fechaMin && !filtros.fechaMax) ||
        (filtros.fechaMax && !filtros.fechaMin)
      )
        return;
      if (new Date(filtros.fechaMin) > new Date(filtros.fechaMax)) {
        toast.error("La fecha desde no puede ser mayor a la fecha hasta");
        return;
      }
      setLoading(true);
      const operacionesReq = await obtenerOperacionesFiltros({
        cuentaId: id as string,
        fechaDesde: filtros.fechaMin,
        fechaHasta: filtros.fechaMax,
        skip: filtros.pagina,
        upTo: quantityPerPage,
        esDebito: filtros.esDebito,
        banco: filtros.banco,
        tipoOperacionId: filtros.tipoOperacionId,
        numeroComprobante:numeroComprobante
      });

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
    } finally {
      setLoading(false);
    }
  }, [id, filtros, quantityPerPage, numeroComprobante, setOperaciones, setindicesPagina]);

  useEffect(() => {
    fetchOperaciones();
  }, [fetchOperaciones]);

  if (loading)
    return (
      <div className="flex justify-center items-center w-full">
        <LoadingCirleIcon className="animate-spin" />
      </div>
    );

  if (operacionesFiltradas.length === 0 && loading === false)
    return (
      <div className="flex justify-center items-center w-full">
        <h1 className="text-xl text-primary-400">
          No hay operaciones para mostrar
        </h1>
      </div>
    );

  return (
    <table className="border-collapse w-full">
      <tbody>
        <tr>
          <td>
            <span className="text-md text-primary-400">Movimiento</span>
          </td>
          <td>
            <span className="text-md mr-2 text-primary-400">Fecha</span>
          </td>
          <td>
            <span className="text-md mr-2 text-primary-400">Hora</span>
          </td>
          <td>
            <span className="text-md mr-2 text-primary-400">Tipo Operacion</span>
          </td>
          <td>
            <span className="text-md mr-2 text-primary-400">Concepto</span>
          </td>
          <td>
            <span className="text-md mr-2 text-primary-400">Monto</span>
          </td>
        </tr>
        {operacionesFiltradas.map((operacion, index) => (
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
                {operacion.tipoOperacion.esDebito ? (
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
                {formatTime(operacion.fechaOperacion)}
              </h1>
            </td>
            <td>
              <h1 className="text-sm font-normal mt-1">
                {operacion.tipoOperacion.nombre}
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
                  operacion.tipoOperacion.esDebito
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {operacion.tipoOperacion.esDebito
                  ? `- ${Number(operacion.monto).toLocaleString("es-PY")} Gs.`
                  : `+ ${Number(operacion.monto).toLocaleString('es-PY')} Gs.`}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

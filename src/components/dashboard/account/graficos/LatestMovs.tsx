import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { obtenerUltimasOperaciones } from "@/lib/actions";
import Link from "next/link";

export type LatestMov = {
  monto: number;
  tipoOperacion: string;
  numeroComprobante: string;
  esDebito: boolean;
  cuentaBancaria: string;
  id: string;
};

export default async function LatestMovs() {
  const latestMovs = await obtenerUltimasOperaciones();
  if (!Array.isArray(latestMovs)) {
    // Manejar el caso en el que latestMovs no es un array
    return <p className="mt-4 text-gray-400">No hay operaciones</p>;
  }

  return (
    <div className="flex w-full mt-4 flex-col gap-2">
      <h2 className={`text-lg font-semibold`}>Últimas Operaciones</h2>
      <div className="flex grow flex-col justify-between bg-gray-900 border border-primary-100 p-2 rounded-md">
        <div className="px-4">
          {latestMovs?.map((mov: LatestMov, i) => {
            return (
              <div
                key={mov.id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t border-gray-700": i !== 0,
                  }
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <span
                      title="Ver detalles del cobro de la factura"
                      className="truncate text-sm font-semibold md:text-base"
                    >
                      {mov.tipoOperacion}
                    </span>
                    <p className="hidden text-sm text-gray-400 sm:block">
                      Comprobante N° {mov.numeroComprobante}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className={`truncate text-sm font-medium md:text-base`}>
                    {mov.monto.toLocaleString("es-PY")} Gs.
                  </p>
                  <Link
                    href={`${mov.cuentaBancaria}/${mov.id}`}
                    className="bg-[#542e9b] text-white rounded-full py-0.5 px-2 text-xs
                    hover:bg-[#4c288f] transition-colors duration-200 "
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

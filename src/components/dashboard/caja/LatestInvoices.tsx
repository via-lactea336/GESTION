import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { LatestInvoice } from "@/lib/definitions";
import { fetchLatestInvoices } from "@/lib/actions";
import Link from "next/link";

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestInvoices();
  if (!Array.isArray(latestInvoices)) {
    // Manejar el caso en el que latestInvoices no es un array
    return <p className="mt-4 text-gray-400">No invoices available.</p>;
  }

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`mb-4 text-xl md:text-2xl`}>Últimas Facturas Cobradas</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-800 p-4">
        <div className="bg-gray-900 rounded-md px-6">
          {latestInvoices?.map((invoice: LatestInvoice, i: Number) => {
            return (
              <div
                key={invoice.id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t border-gray-700": i !== 0,
                  }
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <Link
                      title="Ver detalles del cobro de la factura"
                      href={`/dashboard/caja/historial?query=${invoice.invoiceNumber}&page=1&showModal=true&movimientoId=${invoice.movId}`}
                      className="truncate text-sm font-semibold md:text-base hover:cursor-pointer hover:text-primary-300"
                    >
                      Factura {invoice.type} N° {invoice.invoiceNumber}
                    </Link>
                    <p className="hidden text-sm text-gray-400 sm:block">
                      Cliente: {invoice.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className={`truncate text-sm font-medium md:text-base`}>
                    {invoice.amount.toLocaleString("es-PY")} Gs.
                  </p>
                  <span className="bg-[#542e9b] text-white rounded-full py-0.5 px-2 text-xs">
                    {invoice.paymentStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-400" />
          <h3 className="ml-2 text-sm text-gray-400 ">
            Actualizado hace un momento
          </h3>
        </div>
      </div>
    </div>
  );
}

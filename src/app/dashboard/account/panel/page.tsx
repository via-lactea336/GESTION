import { DonutChart } from "@/components/dashboard/account/graficos/DonutChart";
import Header from "@/components/global/Header";
import { obtenerGastosAgrupados } from "@/lib/actions";
import Link from "next/link";

export default async function Page() {
  const gastos = await obtenerGastosAgrupados();

  return (
    <div>
      <Header title="Panel de Administración" className="-mt-8 mb-8">
        <Link
          href="/dashboard/account"
          className="bg-gray-800 py-1 px-2 rounded-md"
        >
          Cuenta
        </Link>
      </Header>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">
          Importe de gastos por tipo de operación
        </h3>
        <DonutChart data={gastos} />
      </div>
    </div>
  );
}

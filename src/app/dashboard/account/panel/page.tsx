import BarChart from "@/components/dashboard/account/graficos/BarChart";
import { DonutChart } from "@/components/dashboard/account/graficos/DonutChart";
import LatestMovs from "@/components/dashboard/account/graficos/LatestMovs";
import Header from "@/components/global/Header";
import { obtenerGastosAgrupados, obtenerSaldoCuentas } from "@/lib/actions";
import Link from "next/link";

export default async function Page() {
  const { ingresos, egresos } = await obtenerGastosAgrupados();
  const balances = await obtenerSaldoCuentas();

  return (
    <div>
      <Header title="Panel de Administración" className="-mt-8 mb-4">
        <Link
          href="/dashboard/account"
          className="bg-gray-800 py-1 px-2 rounded-md"
        >
          Cuentas
        </Link>
      </Header>
      <div className="flex gap-8">
        <DonutChart
          data={ingresos}
          title="Importe de Ingresos por Tipo de Operación"
        />
        <DonutChart
          data={egresos}
          title="Importe de Egresos por Tipo de Operación"
        />
      </div>
      <div className="flex gap-8">
        <LatestMovs />
        <BarChart balances={balances} />
      </div>
    </div>
  );
}

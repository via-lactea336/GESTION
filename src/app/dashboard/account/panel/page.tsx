import BarChart from "@/components/dashboard/account/graficos/BarChart";
import { DonutChart } from "@/components/dashboard/account/graficos/DonutChart";
import Header from "@/components/global/Header";
import { obtenerGastosAgrupados, obtenerSaldoCuentas } from "@/lib/actions";
import Link from "next/link";

export default async function Page() {
  const gastos = await obtenerGastosAgrupados();
  const balances = await obtenerSaldoCuentas();

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
      <div className="flex gap-8">
        <DonutChart data={gastos} />
        <BarChart balances={balances} />
      </div>
    </div>
  );
}

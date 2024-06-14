import { generateYAxis } from "@/lib/utils";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Revenue } from "@/lib/definitions";
import { fetchRevenue } from "@/lib/actions";

export default async function RevenueChart() {
  const revenue = await fetchRevenue();
  const chartHeight = 302;
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!Array.isArray(revenue)) {
    // Manejar el caso en el que revenue no es un array
    return <p className="mt-4 text-gray-400">No revenue data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`mb-4 text-xl md:text-2xl`}>Ingresos Recientes</h2>
      <div className="rounded-xl bg-gray-800 p-4">
        <div className="flex items-center justify-start gap-2 bg-gray-900 rounded-md p-4">
          <div
            className="mb-12 hidden w-12 flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels?.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>
          <div className="w-full mt-0 grid grid-cols-[repeat(12,minmax(0,1fr))] items-end gap-4 rounded-md bg-gray-900 p-4 md:gap-4">
            {revenue?.map((month) => (
              <div
                key={month.month}
                className="flex flex-col items-center gap-2 relative group"
              >
                <div
                  className="w-full rounded-md bg-[#542e9b] hover:bg-[#6d48b6] transition-colors duration-300 ease-in-out"
                  style={{
                    height: `${(chartHeight / topLabel) * month.revenue}px`,
                  }}
                >
                  <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-full px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ₲{month.revenue.toLocaleString("es-PY")}
                  </div>
                </div>
                <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                  {month.month}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <h3 className="ml-2 text-sm text-gray-400 ">Últimos 12 meses</h3>
        </div>
      </div>
    </div>
  );
}

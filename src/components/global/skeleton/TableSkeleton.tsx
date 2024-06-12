export default function TableSkeleton() {
  const skeletonRows = Array.from({ length: 7 }); // Create 5 skeleton rows

  return (
    <table className="hidden min-w-full bg-gray-900 rounded-md text-white md:table">
      <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
            Operación
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Fecha
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Hora
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Monto
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Concepto
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Detalles
          </th>
        </tr>
      </thead>
      <tbody className="bg-gray-800 text-white text-left">
        {skeletonRows.map((_, index) => (
          <tr
            key={index}
            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-t-none  [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td className="whitespace-nowrap py-3 pl-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-40 h-4 bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              <div className="w-24 h-4 bg-gray-700 rounded-md animate-pulse"></div>
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              <div className="w-16 h-4 bg-gray-700 rounded-md animate-pulse"></div>
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              <div className="w-20 h-4 bg-gray-700 rounded-md animate-pulse"></div>
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              <div className="w-56 h-4 bg-gray-700 rounded-md animate-pulse"></div>
            </td>
            <td className="whitespace-nowrap py-3 pl-6">
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

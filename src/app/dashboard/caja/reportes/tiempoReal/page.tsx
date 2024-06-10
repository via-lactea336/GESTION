import { obtenerMovimientos } from "@/lib/moduloCaja/movimiento/obtenerMovimientos";

export default async function Page() {
  const response = await obtenerMovimientos();
  const ingresos = response.data.filter((movimiento) => movimiento.esIngreso);
  const egresos = response.data.filter((movimiento) => !movimiento.esIngreso);
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex-col bg-gray-900 p-5">
        <h2>Ingresos</h2>
        {ingresos.map((movimiento, i) => (
          <div key={movimiento.id}>
            <p>{i}</p>
            <p>{movimiento.aperturaId}</p>
            <p>{movimiento.esIngreso}</p>
            <p>{Number(movimiento.monto).toLocaleString("es-PY")}</p>
            <p>{movimiento.facturaId}</p>
          </div>
        ))}
      </div>
      <div className="flex-col bg-gray-900 p-5">
        <h2>Egresos</h2>
        {egresos.map((movimiento, i) => (
          <div key={movimiento.id}>
            <p>{i}</p>
            <p>{movimiento.aperturaId}</p>
            <p>{movimiento.esIngreso}</p>
            <p>{Number(movimiento.monto).toLocaleString("es-PY")}</p>
            <p>{movimiento.facturaId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

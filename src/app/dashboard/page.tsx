import obtenerAperturas from "@/lib/moduloCaja/aperturaCaja/obtenerAperturas";
import verificarApiResponse from "@/lib/verificarApiResponse";

export default async function Page() {
  const response = await obtenerAperturas();
  const { data, mensaje } = verificarApiResponse(response);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">Bienvenido al dashboard!</p>
      {data.length === 0 && <p>{mensaje}</p>}
      {data.map((apertura) => (
        <div key={apertura.id}>
          <p>{apertura.id}</p>
          <p>{apertura.cajeroId}</p>
        </div>
      ))}
    </div>
  );
}

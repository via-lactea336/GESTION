import { useState, useEffect } from "react";
import obtenerFacturasFiltro, {
  Filter,
} from "@/lib/moduloCaja/factura/obtenerFacturasFiltro"; // Asegúrate de ajustar la ruta según la ubicación de tu archivo obtenerFacturasFiltro
import { Factura } from "@prisma/client";
import obtenerCliente from "@/lib/moduloCaja/cliente/obtenerCliente";
import LoadingCirleIcon from "../global/LoadingCirleIcon";

interface FacturaConRuc extends Factura {
  ruc: string;
}

const ContenidoIngresos = () => {
  const [filters, setFilters] = useState<Filter>({
    skip: 0,
    upTo: 10,
  });

  const [listaDeFacturas, setListaDeFacturas] = useState<FacturaConRuc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await obtenerFacturasFiltro({
        fechaDesde: filters.fechaDesde,
        fechaHasta: filters.fechaHasta,
        ruc: filters.ruc,
        pagado: filters.pagado,
        esContado: filters.esContado,
        skip: filters.skip ? filters.skip : undefined,
        upTo: filters.upTo ? filters.skip : undefined,
      });
      if (response === undefined || typeof response === "string") {
        setLoading(false);
        setListaDeFacturas([]);
        return;
      }
      const { success, data, error } = response;
      if (success == true && data) {
        const facturasConRuc = await Promise.all(
          data.values.map(async (factura) => {
            const responseCliente = await obtenerCliente(factura.clienteId);
            if (
              typeof responseCliente === "string" ||
              responseCliente === undefined
            ) {
              throw new Error("Error al obtener el cliente");
            }
            const cliente = responseCliente.data;
            return { ...factura, ruc: cliente.docIdentidad };
          })
        );
        setLoading(false);
        setListaDeFacturas(facturasConRuc);
      } else {
        setLoading(false);
        setListaDeFacturas([]);
        setError(error || null);
      }
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    // Fetch initial data
    handleSearch();
  }, []);

  return (
    <>
      <div className="flex flex-row rounded my-2 p-4 bg-neutral-700">
        <div className="flex flex-col w-full">
          <h1 className="text-2xl font-bold">Ingresos</h1>
          <div className="flex flex-row flex-wrap justify-between my-2">
            <div className="flex flex-col flex-grow m-2">
              <label htmlFor="ruc" className="my-2">
                Ingrese el RUC sin puntos:
              </label>
              <input
                type="text"
                id="ruc"
                name="ruc"
                value={filters.ruc}
                onChange={handleChange}
                className="rounded p-2"
                required
              />
            </div>
            <div className="flex flex-col flex-grow m-2">
              <label htmlFor="fechaDesde" className="my-2">
                Fecha Desde:
              </label>
              <input
                type="date"
                id="fechaDesde"
                name="fechaDesde"
                value={filters.fechaDesde}
                onChange={handleChange}
                className="rounded p-1"
                max={
                  filters.fechaHasta
                    ? filters.fechaHasta
                    : new Date().toISOString().split("T")[0]
                }
              />
            </div>
            <div className="flex flex-col flex-grow m-2">
              <label htmlFor="fechaHasta" className="my-2">
                Fecha Hasta:
              </label>
              <input
                type="date"
                id="fechaHasta"
                name="fechaHasta"
                value={filters.fechaHasta}
                onChange={handleChange}
                className="rounded p-1"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex flex-col flex-grow m-2">
              <label htmlFor="pagado" className="my-2">
                Pagado:
              </label>
              <select
                id="pagado"
                name="pagado"
                value={"true"}
                onChange={handleChange}
                className="rounded p-2"
              >
                <option value="">Seleccione</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="flex flex-col flex-grow m-2">
              <label htmlFor="esContado" className="my-2">
                Es Contado:
              </label>
              <select
                id="esContado"
                name="esContado"
                value={""}
                onChange={handleChange}
                className="rounded p-2"
              >
                <option value="">Seleccione</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="flex flex-col flex-grow m-2 justify-end">
              <button
                onClick={handleSearch}
                className="p-2 bg-primary-700 text-white rounded h-auto"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <h2 className="text-xl font-bold my-4">Listado de Facturas</h2>
        {error && <p className="text-red-500">{error}</p>}
        <table className="min-w-full">
          <thead className="w-full text-start">
            <tr>
              <th className="py-2">RUC</th>
              <th className="py-2">Fecha</th>
              <th className="py-2">Es Contado</th>
              <th className="py-2">IVA</th>
              <th className="py-2">Monto Pagado</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="py-2">
                  <div className="flex justify-center items-center w-full">
                    <LoadingCirleIcon className="animate-spin" />
                  </div>
                </td>
              </tr>
            )}
            {listaDeFacturas.length === 0 && !loading ? (
              <tr className="py-2">
                <td colSpan={6} className="text-center">
                  No hay facturas
                </td>
              </tr>
            ) : (
              listaDeFacturas.map((factura, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{factura.ruc}</td>
                  <td className="py-2">
                    {new Date(factura.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2">{factura.esContado ? "Sí" : "No"}</td>
                  <td className="py-2">{+factura.ivaTotal}</td>
                  <td className="py-2">{+factura.totalSaldoPagado}</td>
                  <td className="py-2">{+factura.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ContenidoIngresos;

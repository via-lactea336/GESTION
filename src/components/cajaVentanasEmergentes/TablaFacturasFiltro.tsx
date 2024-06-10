import { useState, useEffect } from "react";
import obtenerFacturasFiltro, {
  FacturaAndClient,
  Filter,
} from "@/lib/moduloCaja/factura/obtenerFacturasFiltro"; 
import LoadingCirleIcon from "../global/LoadingCirleIcon";
import Pagination from "../global/Pagination";
import { useRouter } from "next/navigation";
import { CheckIcon, MagnifyingGlassIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ContenidoIngresos = () => {
  const router = useRouter();
  const initialFilters: Filter = {
    skip: 0,
    upTo: 10,
  };

  const [tempFilters, setTempFilters] = useState<Filter>(initialFilters);
  const [filters, setFilters] = useState<Filter>(initialFilters);
  const [listaDeFacturas, setListaDeFacturas] = useState<FacturaAndClient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [indiceActual, setIndiceActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setFilters(tempFilters);
  };

  const handleClearFilters = () => {
    setTempFilters(initialFilters);
    setFilters(initialFilters);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { success, data, error, message } = await obtenerFacturasFiltro({
        fechaDesde: filters.fechaDesde,
        fechaHasta: filters.fechaHasta,
        ruc: filters.ruc,
        pagado: filters.pagado,
        esContado: filters.esContado,
        numeroFactura: filters.numeroFactura,
        skip: filters.skip,
        upTo: filters.upTo,
      });
      if (!success) {
        setLoading(false);
        setListaDeFacturas([]);
        return;
      }
      if (success == true && data) {
        setListaDeFacturas(data.values);
        setTotalPaginas(Math.ceil(data.totalQuantity / filters.upTo));
      } else {
        setListaDeFacturas([]);
        setError(error || null);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const changeIndicePagina = (indice: number) => {
    setIndiceActual(indice);
    setFilters((prevFilters) => ({
      ...prevFilters,
      skip: indice * filters.upTo,
    }));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <>
      <div className="flex flex-row rounded my-2 p-4 bg-gray-800">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Ingresos</h1>
            <div className="flex flex-row-reverse ml-4 items-center gap-4">
              <div className="">
                <button
                  onClick={handleClearFilters}
                  className="p-2 bg-gray-700 text-white rounded h-auto hover:bg-gray-600"
                >
                  <TrashIcon title="limpiar filtros" className="h-5 w-5" />
                </button>
              </div>
              <div className="">
                <button
                  onClick={handleSearch}
                  className="p-2 bg-primary-700 text-white rounded h-auto hover:bg-primary-800"
                >
                  <MagnifyingGlassIcon title="buscar" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-wrap justify-around gap-4 items-center my-2">
            <div className="flex flex-col my-2">
              <label htmlFor="ruc" className="my-2">
                Ingrese el RUC:
              </label>
              <input
                type="text"
                placeholder="82132341-0"
                id="ruc"
                name="ruc"
                value={tempFilters.ruc || ""}
                onChange={handleChange}
                className="rounded px-2 py-1 "
                required
              />
            </div>
            <div className="flex flex-col my-2">
              <label htmlFor="numeroFactura" className="my-2">
                N° Factura:
              </label>
              <input
                type="text"
                placeholder="00000001"
                id="numeroFactura"
                name="numeroFactura"
                value={tempFilters.numeroFactura || ""}
                onChange={handleChange}
                className="rounded px-2 py-1 "
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="fechaDesde" className="my-2">
                Fecha Desde:
              </label>
              <input
                type="date"
                id="fechaDesde"
                name="fechaDesde"
                value={tempFilters.fechaDesde || ""}
                onChange={handleChange}
                className="rounded p-1"
                max={
                  tempFilters.fechaHasta
                    ? tempFilters.fechaHasta
                    : new Date().toISOString().split("T")[0]
                }
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="fechaHasta" className="my-2">
                Fecha Hasta:
              </label>
              <input
                type="date"
                id="fechaHasta"
                name="fechaHasta"
                value={tempFilters.fechaHasta || ""}
                onChange={handleChange}
                className="rounded p-1"
                min={tempFilters.fechaDesde || ""}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="pagado" className="my-2">
                Pagado:
              </label>
              <select
                id="pagado"
                name="pagado"
                value={tempFilters.pagado ? tempFilters.pagado.toString() : ""}
                onChange={handleChange}
                className="rounded p-2"
              >
                <option value="">Seleccione</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="esContado" className="my-2">
                Tipo:
              </label>
              <select
                id="esContado"
                name="esContado"
                value={
                  tempFilters.esContado ? tempFilters.esContado.toString() : ""
                }
                onChange={handleChange}
                className="rounded p-2"
              >
                <option value="">Seleccione</option>
                <option value="true">Contado</option>
                <option value="false">Crédito</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <h2 className="text-xl font-bold my-4">Listado de Facturas</h2>
        {error && <p className="text-red-500">{error}</p>}
        {
          listaDeFacturas.length === 0 && !loading?
          <div>
            <h2 className="border border-white py-2 px-1 text-center">No hay facturas</h2>
          </div>
        :
          loading?
            <div className="h-64 flex items-center justify-center w-full">
              <LoadingCirleIcon className="w-12 h-12 animate-spin m-auto" />
            </div>
        :
          <table className="min-w-full border-collapse border border-white">
          <thead className="w-full text-start border border-white">
            <tr>
              <th className="py-2 border border-white">N° Factura</th>
              <th className="py-2 border border-white">RUC</th>
              <th className="py-2 border border-white">Cliente</th>
              <th className="py-2 border border-white">Fecha de Emision</th>
              <th className="py-2 border border-white">Pagado</th>
              <th className="py-2 border border-white">Tipo</th>
              <th className="py-2 border border-white">IVA</th>
              <th className="py-2 border border-white">Monto Pagado</th>
              <th className="py-2 border border-white">Monto Factura</th>
              <th className="py-2 border border-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
            listaDeFacturas.map((factura) => {
              return(
                <tr key={factura.id} className="border-t border-white">
                  <td className="py-2 px-1 border border-white">
                    {factura.numeroFactura}
                  </td>
                  <td className="py-2 px-1 border border-white">
                    {factura.cliente.docIdentidad}
                  </td>
                  <td className="py-2 px-1 border border-white">
                    {factura.cliente.nombre}
                  </td>
                  <td className="py-2 px-1 border border-white">
                    {new Date(factura.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-1 border border-white text-center">
                    {factura.pagado ? 
                      <CheckIcon className="w-5 h-5 text-green-500 m-auto"  /> 
                      : 
                      <XMarkIcon className="w-10 h-10 text-red-500 m-auto" />}
                  </td>
                  <td className="py-2 px-1 border border-white">
                    {factura.esContado ? "Contado" : "Credito"}
                  </td>
                  <td className="py-2 px-1 border border-white">
                    {+factura.ivaTotal}
                  </td>
                  <td className="py-2 px-1 border border-white">
                    {Number(factura.totalSaldoPagado).toLocaleString()}
                  </td>
                  <td className="py-2 px-1 border border-white">
                    {Number(factura.total).toLocaleString()}
                  </td>
                  <td className="py-2 px-1 border border-white">
                    <div className="flex justify-center">
                      <button
                        className="p-2 bg-primary-700 text-white rounded disabled:opacity-10"
                        onClick={() => router.push(`ingreso/${factura.id}`)}
                        {...(factura.total === factura.totalSaldoPagado
                          ? { disabled: true }
                          : { disabled: false })}
                      >
                        Pagar
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
        }
        {
          !loading && listaDeFacturas.length !== 0 &&
          <Pagination
            changeIndicePagina={changeIndicePagina}
            indiceActual={indiceActual}
            indicesPagina={totalPaginas}
          />
        }
      </div>
    </>
  );
};

export default ContenidoIngresos;

"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/global/Modal";
import FormArqueo from "@/components/cajaVentanasEmergentes/FormArqueo";
import { ArqueoCajaData, Cajero } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { AperturaCaja, Caja } from "@prisma/client";
import { useRouter } from "next/navigation";
import Input from "@/components/global/Input";
import crearArqueo from "@/lib/arqueoCaja/crearArqueo";
import Header from "@/components/global/Header";
import { Toaster, toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const caja: Caja = obtenerCookie("caja");
  const cajero: Cajero = obtenerCookie("cajero");
  const apertura: AperturaCaja = obtenerCookie("apertura");
  const [denominaciones, setDenominaciones] = useState({
    moneda500: 0,
    moneda1000: 0,
    billete2000: 0,
    billete5000: 0,
    billete10000: 0,
    billete20000: 0,
    billete50000: 0,
    billete100000: 0,
  });

  const [totalEfectivo, setTotalEfectivo] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setDenominaciones({
      ...denominaciones,
      [name]: Number(value),
    });
  };

  const verificarCierre = async () => {
    try {
      setLoading(true);
      const arqueo: ArqueoCajaData = {
        aperturaId: apertura.id,
        montoRegistrado: totalEfectivo,
      };
      const response = await crearArqueo(arqueo);
      if (response === undefined || typeof response === "string") {
        throw new Error("Error al cerrar la caja");
      }
      if (response.error) {
        throw new Error(response.error);
      }
      setLoading(false);
      toast.success("Caja cerrada con éxito");
      router.push("/dashboard/caja");
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setShowModal(true);
    }
  };

  useEffect(() => {
    let total = 0;
    total += denominaciones.moneda500 * 500;
    total += denominaciones.moneda1000 * 1000;
    total += denominaciones.billete2000 * 2000;
    total += denominaciones.billete5000 * 5000;
    total += denominaciones.billete10000 * 10000;
    total += denominaciones.billete20000 * 20000;
    total += denominaciones.billete50000 * 50000;
    total += denominaciones.billete100000 * 100000;
    setTotalEfectivo(total);
  }, [denominaciones]);

  return (
    <div>
      <Header
        title="Arqueo de Caja"
        className={showModal ? "blur-sm brightness-50" : "-mt-8"}
      >
        <h3 className="px-2">{cajero.nombre}</h3>
        <h3 className="px-2">Caja N°{caja.numero}</h3>
        <h3 className="px-2">
          {new Date()
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")}
        </h3>
      </Header>
      <div
        className={
          showModal
            ? "blur-sm brightness-50 text-white mt-7 flex items-start gap-8"
            : "text-center text-white mt-7 flex items-start gap-8"
        }
      >
        <div className="flex items-center justify-center">
          <table className="text-center text-white min-w-[400px]">
            <thead className="bg-gray-800 text-primary-300">
              <tr>
                <th className="px-4 py-2 min-w-[200px] font-normal">
                  Denominacion
                </th>
                <th className="px-4 py-2 min-w-[200px] font-normal">
                  Cantidad
                </th>
                <th className="px-4 py-2 min-w-[200px] font-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">MONEDA 500</div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    id="moneda500"
                    placeholder="10"
                    value={
                      denominaciones.moneda500 === 0
                        ? ""
                        : denominaciones.moneda500
                    }
                    className="bg-gray-600 max-w-[100px] rounded-md text-center"
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">
                    {(denominaciones.moneda500 * 500).toLocaleString("de-DE")}{" "}
                    Gs.
                  </div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">MONEDA 1.000</div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    id="moneda1000"
                    placeholder="15"
                    value={
                      denominaciones.moneda1000 === 0
                        ? ""
                        : denominaciones.moneda1000
                    }
                    className="bg-gray-600 max-w-[100px] rounded-md text-center"
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">
                    {(denominaciones.moneda1000 * 1000).toLocaleString("de-DE")}{" "}
                    Gs.
                  </div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 2.000</div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    id="billete2000"
                    placeholder="30"
                    value={
                      denominaciones.billete2000 === 0
                        ? ""
                        : denominaciones.billete2000
                    }
                    className="bg-gray-600 max-w-[100px] rounded-md text-center"
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">
                    {(denominaciones.billete2000 * 2000).toLocaleString(
                      "de-DE"
                    )}{" "}
                    Gs.
                  </div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 5.000</div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    id="billete5000"
                    placeholder="50"
                    value={
                      denominaciones.billete5000 === 0
                        ? ""
                        : denominaciones.billete5000
                    }
                    className="bg-gray-600 max-w-[100px] rounded-md text-center"
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">
                    {(denominaciones.billete5000 * 5000).toLocaleString(
                      "de-DE"
                    )}{" "}
                    Gs.
                  </div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 10.000</div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    id="billete10000"
                    placeholder="50"
                    value={
                      denominaciones.billete10000 === 0
                        ? ""
                        : denominaciones.billete10000
                    }
                    className="bg-gray-600 max-w-[100px] rounded-md text-center"
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">
                    {(denominaciones.billete10000 * 10000).toLocaleString(
                      "de-DE"
                    )}{" "}
                    Gs.
                  </div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 20.000</div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    id="billete20000"
                    placeholder="40"
                    value={
                      denominaciones.billete20000 === 0
                        ? ""
                        : denominaciones.billete20000
                    }
                    className="bg-gray-600 max-w-[100px] rounded-md text-center"
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">
                    {(denominaciones.billete20000 * 20000).toLocaleString(
                      "de-DE"
                    )}{" "}
                    Gs.
                  </div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 50.000</div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    id="billete50000"
                    placeholder="25"
                    value={
                      denominaciones.billete50000 === 0
                        ? ""
                        : denominaciones.billete50000
                    }
                    className="bg-gray-600 max-w-[100px] rounded-md text-center"
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">
                    {(denominaciones.billete50000 * 50000).toLocaleString(
                      "de-DE"
                    )}{" "}
                    Gs.
                  </div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 100.000</div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    id="billete100000"
                    placeholder="20"
                    value={
                      denominaciones.billete100000 === 0
                        ? ""
                        : denominaciones.billete100000
                    }
                    className="bg-gray-600 max-w-[100px] rounded-md text-center"
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">
                    {(denominaciones.billete100000 * 100000).toLocaleString(
                      "de-DE"
                    )}{" "}
                    Gs.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="">
          <h1 className="mb-5 mt-10">
            Total En Efectivo: {totalEfectivo.toLocaleString("de-DE")} Gs.
          </h1>
          <button
            className="bg-primary-800 p-3 min-w-[300px] rounded-md hover:bg-primary-700 transition-all duration-300 ease-in-out"
            onClick={verificarCierre}
          >
            {loading ? "Cerrando caja..." : "Realizar Cierre"}
          </button>
        </div>
      </div>
      {showModal && (
        <div className="flex items-center justify-center">
          <div className="absolute top-20">
            <Modal className="w-full" setShowModal={setShowModal}>
              <FormArqueo />
            </Modal>
          </div>
        </div>
      )}
      <Toaster richColors />
    </div>
  );
}
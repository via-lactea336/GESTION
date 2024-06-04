"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/global/Modal";
import FormArqueo from "@/components/cajaVentanasEmergentes/FormArqueo";
import { ArqueoCajaData, Cajero } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { AperturaCaja, Caja } from "@prisma/client";
import Input from "@/components/global/Input";
import crearArqueo from "@/lib/arqueoCaja/crearArqueo";

export default function Page() {
  const caja: Caja = obtenerCookie("caja");
  const cajero: Cajero = obtenerCookie("cajero");
  const apertura: AperturaCaja = obtenerCookie("apertura");
  const [exito, setExito]= useState(false);
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

  const verificarCierre = async() =>{
    try {
      const arqueo: ArqueoCajaData = {
        aperturaId: apertura.id,
        montoRegistrado: totalEfectivo
      }
      const response = await crearArqueo(arqueo);
      if (response === undefined || typeof response === "string") {
          throw new Error("Error obteniendo las cuentas");
      }
      console.log(response);
      setExito(true);
    } catch (error) {
        console.error(error);
    }
    setShowModal(true);
  }

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
      <div
        className={
          showModal
            ? "blur-sm brightness-50 p-10 -mt-7 bg-primary-800"
            : "p-10 -mt-7 bg-primary-800"
        }
      >
        <div className="flex flex-row ">
          <h1 className="text-3xl font-bold mt-2 mb-2">Arqueo de caja</h1>
          <p className="font-bold mt-4 mb-2 ml-auto">
            Cajero : {cajero.nombre}
          </p>
          <p className="font-bold mt-4 mb-2 ml-10">N° Caja : {caja.numero}</p>
        </div>
      </div>
      <div
        className={
          showModal
            ? "blur-sm brightness-50 text-white  mt-10"
            : "text-center text-white mt-10"
        }
      >
        <div className="flex items-center justify-center min-h-screen -mt-20">
          <table className="text-center text-white min-w-[400px]">
            <thead className="bg-primary-700 text-black">
              <tr>
                <th className="px-4 py-2 min-w-[200px]">Denominacion</th>
                <th className="px-4 py-2 min-w-[200px]">Cantidad</th>
                <th className="px-4 py-2 min-w-[200px]">Total</th>
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
                    placeholder="500.000"
                    value={denominaciones.moneda500}
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
                    placeholder="1.000.000"
                    value={denominaciones.moneda1000}
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
                    placeholder="2.000.000"
                    value={denominaciones.billete2000}
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
                    placeholder="5.000.000"
                    value={denominaciones.billete5000}
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
                    placeholder="10.000.000"
                    value={denominaciones.billete10000}
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
                    placeholder="20.000.000"
                    value={denominaciones.billete20000}
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
                    placeholder="50.000.000"
                    value={denominaciones.billete50000}
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
                    placeholder="100.000.000"
                    value={denominaciones.billete100000}
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
        <div className="-mt-20">
          <h1 className="mb-5">Total En Efectivo: {totalEfectivo}</h1>
          <button className="bg-primary-400 p-3 min-w-[300px]" onClick={verificarCierre}>Realizar Cierre</button>
        </div>
      </div>
      {showModal && (
        <div className="flex items-center justify-center h-screen">
          <div className="absolute top-20 w-full">
            <Modal setShowModal={setShowModal}>
              <FormArqueo 
                exito = {exito} 
                monto = {totalEfectivo}
              />
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}

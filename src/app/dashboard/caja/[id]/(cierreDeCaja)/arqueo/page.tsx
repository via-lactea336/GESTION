"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/global/Modal";
import FormArqueo from "@/components/cajaVentanasEmergentes/FormArqueo";
import { Cajero } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { AperturaCaja, Caja } from "@prisma/client";
import Input from "@/components/global/Input";

export default function Page() {
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

  const [totales, setTotales] = useState({
    totalEfectivo: 0,
    totalCheque: 0,
    totalTarjetaDebito: 0,
    totalTarjetaCredito: 0,
  });
  const [montoTotal, setMontoTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

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

  const handleChangeTotales = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTotales({
      ...totales,
      [name]: Number(value),
    });
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
    setTotales({
      ...totales,
      ["totalEfectivo"]: total,
    });
  }, [denominaciones]);

  useEffect(() => {
    let monto = 0;
    monto += totales.totalCheque * 1;
    monto += totales.totalTarjetaCredito * 1;
    monto += totales.totalTarjetaDebito * 1;
    monto += totales.totalEfectivo * 1;
    setMontoTotal(monto)
  }, [totales]);

  return (
    <div>
      <div
        className={
          showModal
            ? "blur-sm brightness-50 p-10 -mt-7 bg-primary-800"
            : "p-10 -mt-7 bg-primary-800"
        }>
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
            ? "blur-sm brightness-50 text-white flex flex-row mt-10"
            : "text-center text-white flex flex-row mt-10"
        }
      >
        <div className="bg-primary-500 flex flex-col p-5 rounded-md mb-auto">
          <h1 className="text-center text-xl">Según Cajero</h1>
          <div className="m-5 flex justify-between">
            <label>Efectivo</label>
            <div className="ml-10 rounded-md bg-gray-600 min-w-[195px] text-center">
              {totales.totalEfectivo.toLocaleString("de-DE")}
            </div>
          </div>

          <div className="m-5 flex justify-between">
            <label>Cheque</label>
            <Input
              type="number"
              placeholder="300.000"
              value={totales.totalCheque}
              className="ml-10 rounded-md bg-gray-600 text-center"
              id="totalCheque"
              onChange={handleChangeTotales}
            />
          </div>

          <div className="m-5 flex justify-between">
            <label>Tarj. Crédito</label>
            <Input
              type="number"
              value={totales.totalTarjetaCredito}
              className="ml-10 rounded-md bg-gray-600 text-center"
              id="totalTarjetaCredito"
              placeholder="200.0000"
              onChange={handleChangeTotales}
            />
          </div>

          <div className="m-5 flex justify-between">
            <label>Tarj. Débito</label>
            <Input
              type="number"
              value={totales.totalTarjetaDebito}
              className="ml-10 rounded-md  bg-gray-600 text-center"
              id="totalTarjetaDebito"
              placeholder="100.0000"
              onChange={handleChangeTotales}
            />
          </div>

          <div className="m-5 flex justify-between">
            <label>Total Ingresos</label>
            <div className="ml-10 rounded-md bg-gray-600 min-w-[195px] text-center">
              {montoTotal.toLocaleString("de-DE")}
            </div>
          </div>

          <button
            className="bg-gray-800 ml-10 mt-5 mr-10 pt-3 pb-3"
            onClick={handleClick}
          >
            REALIZAR CIERRE
          </button>
        </div>

        <div className="ml-auto">
          <table className="text-center text-white min-w-[400px] ml-10">
            <thead className="bg-primary-700 text-black">
              <tr>
                <th className="px-4 py-2 ">Denominacion</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2 min-w-[190px]">Total</th>
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
      </div>
      {showModal && (
        <div className="flex items-center justify-center h-screen">
          <div className="absolute top-20 w-full">
            <Modal setShowModal={setShowModal}>
              <FormArqueo id={apertura.id} monto={120000} />
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}

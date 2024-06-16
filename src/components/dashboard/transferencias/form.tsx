"use client";
import Input from "@/components/global/Input";
import InputCalendar from "@/components/global/InputCalendar";
import obtenerBancos from "@/lib/moduloBanco/banco/obtenerBancos";
import obtenerCuentaBancaria from "@/lib/moduloBanco/cuentaBancaria/obtenerCuentaBancaria";
import { CuentaBancariaAndBanco } from "@/lib/moduloBanco/cuentaBancaria/obtenerCuentaBancariaPorId";
import agregarOperacion, { CrearOperacionFields } from "@/lib/moduloBanco/operacion/agregarOperacion";
import obtenerTiposOperacion from "@/lib/moduloBanco/tipoOperacion/obtenerTiposOperacion";
import { Banco, TipoOperacion } from "@prisma/client";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AgregarCheque from "./AgregarCheque";
import { ChequeCreate } from "./AgregarCheque";
import obtenerCuentaBancariaPorId from "@/lib/moduloBanco/cuentaBancaria/obtenerCuentaBancariaPorId";
import Deposito from "./Deposito";
import Retiro from "./Retiro";
import DebitoBancario from "./DebitoBancario";
import Transferencia from "./Transferencia";

type Operacion = {
  tipoOperacionId: string;
  fechaOperacion: Date;
  monto: number;
  cuentaBancariaOrigenId: string;
  bancoInvolucrado: string;
  nombreInvolucrado: string;
  cuentaInvolucrado: string;
  rucInvolucrado: string;
  concepto: string;
  numeroComprobante: string;
};

type Props = {
  cuentaBancariaId: string;
}

export default function FormTransferencias({cuentaBancariaId}:Props) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    setLoadingSend(true);
    event.preventDefault();

    const response = await agregarOperacion({
      tipoOperacionId: operacion.tipoOperacionId,
      fechaOperacion: operacion.fechaOperacion,
      monto: operacion.monto,
      cuentaBancariaOrigenId: cuentaBancariaId,
      bancoInvolucrado: operacion.bancoInvolucrado,
      nombreInvolucrado: operacion.nombreInvolucrado,
      cuentaInvolucrado: operacion.cuentaInvolucrado,
      rucInvolucrado: operacion.rucInvolucrado,
      concepto: operacion.concepto,
      numeroComprobante: operacion.numeroComprobante,
      cheques: cheques
    }
    );
    if (response !== undefined && typeof response !== "string") {
      if (response.error) {
        toast.error(response.error);
        setLoadingSend(false);
      } else {
        setLoadingSend(false);
        toast.success("Operación registrada correctamente");
        setMontoParcial(0);
        setOperacion(prev => ({
          ...prev,
          fechaOperacion: "",
          monto: 0,
          nombreInvolucrado: "",
          concepto: "",
          numeroComprobante: "",
          cuentaInvolucrado: undefined,
          rucInvolucrado: undefined,
          bancoInvolucrado: undefined,
        }));
        setCheques([]);
      }
    }
  };

  //Estado de la operacion a ser creada
  const initialValues = {
    tipoOperacionId: "",
    fechaOperacion: "",
    monto: 0,
    cuentaBancariaOrigenId: cuentaBancariaId,
    nombreInvolucrado: "",
    concepto: "",
    numeroComprobante: "",
    cuentaInvolucrado: undefined,
    rucInvolucrado: undefined,
    bancoInvolucrado: undefined,
  }
  const [operacion, setOperacion] = useState<CrearOperacionFields>(initialValues);

  //Naturaleza de la operacion
  const [nombreOperacion, setNombreOperacion] = useState("");
  const [esDebito, setEsDebito] = useState<boolean>(false);

  //Estados para manejar opciones 
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [cuentasBancaria, setCuentasBancaria] = useState<CuentaBancariaAndBanco|undefined>(undefined);
  const [operaciones, setOperaciones] = useState<TipoOperacion[]>([]);

  //Estados para el manejo de estados de carga/error/finalizado
  const [loading, setLoading] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  //Manejo de cheques
  const [cheques, setCheques] = useState<ChequeCreate[]>([]);
  const [montoParcial, setMontoParcial] = useState<number>(0);

  //Handle onChange of the inputs
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(operacion);
    const { name, value, id, type } = event.target;
    if (type === "datetime-local") setOperacion({ ...operacion, [name || id]: value });
    setOperacion({ ...operacion, [name || id]: value });
  };

  //Fetch data for the form
  const fetchDatos = async () => {
    setLoading(true);
    const bancos = await obtenerBancos();
    const cuentaBancaria = await obtenerCuentaBancariaPorId(cuentaBancariaId);
    const operaciones = await obtenerTiposOperacion();
    if (
      bancos !== undefined &&
      cuentaBancaria !== undefined &&
      operaciones !== undefined &&
      typeof bancos !== "string" &&
      typeof cuentaBancaria !== "string" &&
      typeof operaciones !== "string"
    ) {
      setBancos(bancos.data);
      setCuentasBancaria(cuentaBancaria.data);
      setOperaciones(operaciones.data);
      setEsDebito(operaciones.data[0].esDebito);
      setOperacion({
        ...operacion,
        tipoOperacionId:"",
        bancoInvolucrado: bancos.data[0].id,
      })
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  useEffect(() => {

    switch (nombreOperacion) {
      case "DEBITO BANCARIO":
        if(!cuentasBancaria) {
          alert("No se encontro la cuenta bancaria")
          break
        }
        setOperacion({
          ...operacion,
          cuentaInvolucrado: undefined,
          rucInvolucrado: undefined,
          nombreInvolucrado: cuentasBancaria.banco.nombre,
          bancoInvolucrado: cuentasBancaria.banco.nombre,
        })
        break

      case "Retiro":
        setOperacion({
          ...operacion,
          cuentaInvolucrado: undefined,
          rucInvolucrado: undefined,
          bancoInvolucrado: cuentasBancaria?.banco.nombre,
        })
        break

      default:
        setOperacion({
          ...operacion,
          nombreInvolucrado: initialValues.nombreInvolucrado,
          bancoInvolucrado: initialValues.bancoInvolucrado,
          rucInvolucrado: initialValues.rucInvolucrado,
          cuentaInvolucrado: initialValues.cuentaInvolucrado,
        })
        break
    }
    setCheques([])
  }, [operacion.tipoOperacionId])

  useEffect(() => {
    const totalMontoCheques = cheques.reduce((acc, cheque) => acc + cheque.monto, 0);
    setOperacion(prev => ({ ...prev, monto: totalMontoCheques + montoParcial }));
  }, [cheques, montoParcial]);

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="w-full mb-6">
        <label className="mb-2">Tipo de Transacción*</label>
        <div className="relative mt-2">
          <select
            className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
            id="tipoOperacionId"
            required
            onChange={(e) => {
              handleOnChange(e);
              setEsDebito(
                operaciones.find((op) => op.id === e.target.value)
                  ?.esDebito || false
              );
              setNombreOperacion(
                operaciones.find((op) => op.id === e.target.value)?.nombre || ""
              )
            }}
          >
            {loading ? (
              <option>Cargando...</option>
            ) : (
              <>
              <option value="">Selecione un tipo de operacion</option>
              {
                operaciones.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.nombre}
                  </option>
                ))
              }
              </>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {
        nombreOperacion === "Depósito" ?
          <Deposito 
            setMontoParcial={setMontoParcial}
            setCheques={setCheques}
            cheques={cheques}
            montoParcial={montoParcial}
            loading={loading}
            operacion={operacion}
            setOperacion={setOperacion}
            handleOnChange={handleOnChange}
            bancos={bancos}
          />
        :
        nombreOperacion === "Retiro"?
          <Retiro 
            setMontoParcial={setMontoParcial}
            handleOnChange={handleOnChange}
            loading={loading}
            operacion={operacion}
            bancos={bancos}
            monto={montoParcial}
          />
        :
        nombreOperacion === "DEBITO BANCARIO"?
          <DebitoBancario
            handleOnChange={handleOnChange}
            loading={loading}
            operacion={operacion}
            monto={montoParcial}
            setMontoParcial={setMontoParcial}
          />
        :
        nombreOperacion.startsWith("TRANSFERENCIA")?
        <Transferencia 
          handleOnChange={handleOnChange}
          loading={loading}
          operacion={operacion}
          monto={montoParcial}
          setMontoParcial={setMontoParcial}
          esDebito={esDebito}
          bancos={bancos}
        />
        :
        null
      }

      {
      operacion.tipoOperacionId.trim() !== "" && 
      <div className="px-3 flex items-center justify-end mb-6 md:mb-0">
        <button
          type="submit"
          className={
            "bg-primary-800 mt-4 rounded-md px-3 py-3  hover:bg-primary-700 " +
            (loading || loadingSend ? " cursor-progress" : "cursor-pointer")
          }
        >
          {loadingSend ? "Registrando..." : "Registrar Transacción"}
        </button>
      </div>
      }
      <Toaster richColors />
    </form>
  );
}
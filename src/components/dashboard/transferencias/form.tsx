"use client";
import Input from "@/components/global/Input";
import InputCalendar from "@/components/global/InputCalendar";
import obtenerBancos from "@/lib/moduloBanco/banco/obtenerBancos";
import obtenerCuentaBancaria from "@/lib/moduloBanco/cuentaBancaria/obtenerCuentaBancaria";
import { CuentaBancariaAndBanco } from "@/lib/definitions";
import agregarOperacion, { CrearOperacionFields } from "@/lib/moduloBanco/operacion/agregarOperacion";
import obtenerTiposOperacion from "@/lib/moduloBanco/tipoOperacion/obtenerTiposOperacion";
import { Banco, TipoOperacion } from "@prisma/client";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AgregarCheque from "./AgregarCheque";
import { ChequeCreate } from "./AgregarCheque";

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

export default function FormTransferencias() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    setLoadingSend(true);
    event.preventDefault();

    console.log("Operacion:", operacion, "\n Cheques:", cheques)

    const response = await agregarOperacion({
      tipoOperacionId: operacion.tipoOperacionId,
      fechaOperacion: operacion.fechaOperacion,
      monto: operacion.monto,
      cuentaBancariaOrigenId: operacion.cuentaBancariaOrigenId,
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
        setOperacion(prev => ({
          ...prev,
          fechaOperacion: "",
          monto: 0,
          cuentaBancariaOrigenId: "",
          nombreInvolucrado: "",
          concepto: "",
          numeroComprobante: "",
          cuentaInvolucrado: undefined,
          rucInvolucrado: undefined,
          bancoInvolucrado: undefined,
        }));
        setCheques([]);
        setFinished(prev => !prev);
      }
    }
  };

  //Estado de la operacion a ser creada
  const initialValues = {
    tipoOperacionId: "",
    fechaOperacion: "",
    monto: 0,
    cuentaBancariaOrigenId: "",
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
  const [cuentasBancarias, setCuentasBancarias] = useState<CuentaBancariaAndBanco[]>([]);
  const [operaciones, setOperaciones] = useState<TipoOperacion[]>([]);

  //Estados para el manejo de estados de carga/error/finalizado
  const [loading, setLoading] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [finished, setFinished] = useState(false);

  //Manejo de cheques
  const [cheques, setCheques] = useState<ChequeCreate[]>([]);
  const [montoParcial, setMontoParcial] = useState<number>(0);

  //Handle onChange of the inputs
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, id, type } = event.target;
    if (type === "datetime-local") setOperacion({ ...operacion, [name || id]: value });
    setOperacion({ ...operacion, [name || id]: value });
  };

  //Fetch data for the form
  const fetchDatos = async () => {
    setLoading(true);
    const bancos = await obtenerBancos();
    const cuentasBancarias = await obtenerCuentaBancaria();
    const operaciones = await obtenerTiposOperacion();
    if (
      bancos !== undefined &&
      cuentasBancarias !== undefined &&
      operaciones !== undefined &&
      typeof bancos !== "string" &&
      typeof cuentasBancarias !== "string" &&
      typeof operaciones !== "string"
    ) {
      setBancos(bancos.data);
      setCuentasBancarias(cuentasBancarias.data);
      setOperaciones(operaciones.data);
      setEsDebito(operaciones.data[0].esDebito);
      setNombreOperacion(operaciones.data[0].nombre);
      setOperacion({
        ...operacion,
        tipoOperacionId:"",
        cuentaBancariaOrigenId: "",
        bancoInvolucrado: bancos.data[0].id,
      })
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  useEffect(() => {
    setOperacion({
      ...operacion,
      nombreInvolucrado: initialValues.nombreInvolucrado,
      bancoInvolucrado: initialValues.bancoInvolucrado,
      rucInvolucrado: initialValues.rucInvolucrado,
      cuentaInvolucrado: initialValues.cuentaInvolucrado,
    })
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
      operacion.tipoOperacionId && 
      <div className="flex sm:flex-row flex-wrap flex-col box-border gap-3 w-full">

        <div className="flex flex-col ">
          <label className="mb-2">
            Cuenta del {
              !esDebito ? "Beneficiario" : "Remitente"
            }
          </label>
          <div className="relative mt-2">
            <select
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              onChange={handleOnChange}
              id="cuentaBancariaOrigenId"
              required
            >
              {loading ? (
                <option>Cargando...</option>
              ) : (
                <>
                  <option value="">Seleccionar Cuenta</option>
                  {
                    cuentasBancarias.map((cuenta) => (
                      <option key={cuenta.id} value={cuenta.id}>
                        {cuenta.banco.nombre.split("Banco")} {cuenta.numeroCuenta}
                      </option>
                    ))
                  }
                </>
              )
              }
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
        nombreOperacion === "Transferencia" && 
        <div className="flex flex-col ">
          <label className="mb-2">
            Banco del {esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <div className="relative mt-2">
            <select
              onChange={handleOnChange}
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id="bancoInvolucrado"
              required
            >
              {loading ? (
                <option>Cargando...</option>
              ) : (
                bancos.map((banco) => (
                  <option key={banco.id} value={banco.nombre}>{banco.nombre}</option>
                ))
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
      }
      
        
      {
        nombreOperacion === "Transferencia" && 
        <div className="flex flex-col ">
          <label className="mb-2">
            Cuenta del {esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="cuentaInvolucrado"
            onChange={handleOnChange}
            required
            type="text"
            placeholder="Cuenta del involucrado"
          />
        </div>
      }

        <div className="flex flex-col ">
          <label className=" mb-2">
            {
              nombreOperacion === "Depósito"? "Nombre del Depositante*" :
              nombreOperacion === "Retiro"? "Titular de la Cuenta*" :
              esDebito ? "Nombre delBeneficiario" : "Nombre del Remitente"
            }
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="nombreInvolucrado"
            onChange={handleOnChange}
            type="text"
            required
            placeholder="Ingrese el nombre"
          />
        </div>
        <div className="flex flex-col ">
          <label className="mb-2">Ruc</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="rucInvolucrado"
            onChange={handleOnChange}
            type="text"
            required
            placeholder="Ingrese el RUC"
          />
        </div>
        <div className="flex flex-col ">
          <label className=" mb-2">{
            nombreOperacion === "Depósito"? "Efectivo*" 
            : "Monto"
          }</label>
          <Input
            className={'block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none'}
            id="montoParcial"
            onChange={(e) => setMontoParcial(Number(e.target.value))} 
            value={montoParcial}
            type="formattedNumber"
            required
            placeholder="Ingrese el monto"
          />
        </div>
        <div className="flex flex-col ">
          <label className="mb-2">Número de Comprobante*</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="numeroComprobante"
            type="text"
            onChange={handleOnChange}
            required
            placeholder="Ingrese el numero de comprobante"
          />
        </div>

      <div className="flex w-full gap-3">
        <div className="w-full md:  mb-6 md:mb-0">
          <label className="mb-2">Fecha de la Transacción*</label>
          <InputCalendar
            withTime={true}
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="fechaOperacion"
            handleChange={handleOnChange}
            required
          />
        </div>
        <div className="w-full md:w-2/3 mb-6 md:mb-0">
          <label className="mb-2">Concepto*</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="concepto"
            type="text"
            onChange={handleOnChange}
            required
            placeholder="Ingrese el concepto"
          />
        </div>

      </div>

      {
        nombreOperacion === "Depósito" &&
        <AgregarCheque 
          cheques={cheques}
          setCheques={setCheques}
          handleOnChangeOperacion={handleOnChange}
          loading={loading}
          operacion={operacion}
          setOperacion={setOperacion}
          monto={operacion.monto}
          bancos={bancos}
        />
      }

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
      </div>
    }
      <Toaster richColors />
    </form>
  );
}
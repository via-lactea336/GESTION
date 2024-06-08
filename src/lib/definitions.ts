import {
  Banco,
  Cheque,
  CuentaBancaria,
  Entidad,
  Movimiento,
  Operacion,
  RegistroCaja,
  TipoOperacion,
} from "@prisma/client";

export type LoadingProps = {
  loading: boolean;
};

export type ErrorProps = {
  message: string;
};

export type ApiResponseData<T = undefined> = {
  data: T;
  message?: string;
  error?: string;
  success: boolean;
};

export type OperacionDetails = Operacion & {
  tipoOperacion: TipoOperacion;
  cuentaBancariaOrigen: CuentaBancaria & { banco: Banco } & {
    entidad: Entidad;
  };
};

export type OperacionAndTipoOperacion = Operacion & {
  tipoOperacion: TipoOperacion;
};

export type CuentaBancariaAndBanco = CuentaBancaria & {
  banco: Banco;
};

export type ChequeDetails = Cheque & { cuentaAfectada: CuentaBancaria } & {
  bancoCheque: Banco;
};

export type DatosFiltrados<T> = {
  values: T[];
  totalQuantity: number;
};

export type ChequeAndOperacion = Operacion & { cheques?: Cheque[] };

export type AperturaCajaData = {
  cajaId: string;
  cajeroId: string;
  apertura: Date;
  saldoInicial: number;
  observaciones?: string;
};

export type ArqueoCajaData = {
  aperturaId: string;
  montoRegistrado: number;
  observaciones?: string;
};

export type CajaData = {
  id: string;
  numero: number;
  deleted: Date | null;
};

export type Cajero = {
  id: string;
  nombre: string;
};

export type UserWithName = {
  name: string;
};

export type DatosExtendidosRegistroCaja = RegistroCaja & {
  apertura:{
    movimiento: Movimiento[]
    observaciones: string|null
    arqueo:{
      observaciones: string|null
    }
  }
}
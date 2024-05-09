import { Banco, CuentaBancaria, Entidad, Operacion, TipoOperacion } from "@prisma/client";

export type LoadingProps = {
  loading: boolean;
};

export type ErrorProps = {
  message: string;
};

export type ApiResponseData<T=undefined> = {
  data: T
  message?: string
  error?: string
  success: boolean
}

export type SignUpCredentials = {
  username: string
  password: string
}

export type OperacionDetails = Operacion & {
  tipoOperacion: TipoOperacion;
  cuentaBancariaOrigen: CuentaBancaria & {banco: Banco} & {entidad: Entidad};
}

export type OperacionAndTipoOperacion = Operacion & {
  tipoOperacion: TipoOperacion
}
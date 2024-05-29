import { ApiResponseData } from "./definitions";

type ReturnData<T> = {
  data: T[];
  mensaje: string;
  success: boolean;
};

export default function verificarApiResponse<T = undefined>(
  response: ApiResponseData<T[]> | string | undefined
): ReturnData<T> {
  if (typeof response === "string" || response === undefined)
    return {
      data: [],
      mensaje: response || "Error al conciliar el cheque",
      success: false,
    };

  return {
    data: response.data,
    mensaje: response.message!,
    success: response.success,
  };
}

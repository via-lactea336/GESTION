import { ApiResponseData } from "./definitions";

type ReturnData<T> = {
  data: T[];
  mensaje: string;
  success: boolean;
};

export default function verificarApiResponse<T = undefined>(
  response: ApiResponseData<T[]> | ApiResponseData | string | undefined
): ReturnData<T> {
  if (typeof response === "string" || response === undefined)
    return {
      data: [],
      mensaje: response || "Error al conciliar el cheque",
      success: false,
    };

  return {
    data: response.data || [],
    mensaje: response.message!,
    success: response.success,
 };
}

type FetchPlusRes<T> = {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export const fetchPlus = async <T=undefined>(url:string, options?:RequestInit):Promise<FetchPlusRes<T>> => {
  try{
    //Get the response
    const res = await fetch(url, options)

    //If the error is not ok, return the error and the message of error
    if(!res.ok){
      const dataError:ApiResponseData = await res.json()
      return {error: dataError.error, success: false}
    }

    //If the response is ok, return the data
    const data:ApiResponseData<T> = await res.json()
    return {data: data.data, success: true, message: data.message}

  }catch(e){
    if(e instanceof Error) return {error: e.message, success: false}
    return {error: "Error al obtener la respuesta", success: false}
  }
}

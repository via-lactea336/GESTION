import { ApiResponseData } from "../definitions"

export default async function agregarEntidad(nombre: string): Promise<ApiResponseData|string|undefined> {
  try{
    const response = await fetch("/api/entidad", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({nombre: nombre})
    })

    const data:ApiResponseData = await response.json()
    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}
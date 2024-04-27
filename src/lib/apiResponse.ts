import { NextResponse } from "next/server"
import { ApiResponseData } from "@/lib/definitions"

const generateApiSuccessResponse = <T>(status: number = 200, message?: string, data?: T ) => {
  return new NextResponse<ApiResponseData<T>>(JSON.stringify({ message, data, success:true }), { status: status })
}

const generateApiErrorResponse = (error: string, status: number = 500) => {
  return new NextResponse<ApiResponseData>(JSON.stringify({ error, success: false }), { status: status })
}

export {generateApiSuccessResponse, generateApiErrorResponse}
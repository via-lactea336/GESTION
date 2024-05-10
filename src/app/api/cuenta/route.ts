import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { CuentaBancaria } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

// POST /api/cuenta/
/**
 * It allows to add an bank account in the database
 * @param req The request object were should be the data of the bank account.
 * @returns Returns a NextResponse object.
 */
export async function POST(req: NextRequest) {
  
  //Get the data of the bank account
  const body: CuentaBancaria = await req.json();
  const { numeroCuenta, bancoId, entidadId, esCuentaAhorro, saldo, saldoDisponible } = body;
  
  if(!numeroCuenta || !bancoId || !entidadId || !esCuentaAhorro || !saldo || !saldoDisponible) return generateApiErrorResponse("Missing data to create the bank account", 400) //Validate credentials

  if(Number(saldo) <= 0  || Number(saldoDisponible) <= 0) return generateApiErrorResponse("Saldo invalido", 400)

  //Create new bank account
  try{
    const bankAccount = await prisma.cuentaBancaria.create({
      data: {
        numeroCuenta,
        bancoId,
        entidadId,
        esCuentaAhorro,
        saldo,
        saldoDisponible
      }
    })
  
    if(!bankAccount) return generateApiErrorResponse("Error generating Bank account", 400)  

    //Return success
    return generateApiSuccessResponse(200, "Bank account added successfully")
  
  }catch(err){
    //If the bank account already exists then return an error
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("Bank account already exists", 400)
    if(err instanceof Error) return generateApiErrorResponse(err.message, 500)
    else return generateApiErrorResponse("Something went wrong", 500)
  }  
  
}

//GET /api/cuenta/
/**
 * It allows to get all bank accounts in the database
 * @returns Returns all bank accounts.
 */
export async function GET() {

  //Get all banks
  const bankAccounts = await prisma.cuentaBancaria.findMany()

  //Return success
  return generateApiSuccessResponse(200, "Bank account list", bankAccounts)

}
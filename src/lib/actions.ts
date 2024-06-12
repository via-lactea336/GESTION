"use server";

import { medioDePago } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import crearMovimiento from "./moduloCaja/movimiento/crearMovimiento";

type ParamsMovimientos = {
  mov: {
    aperturaId: string;
    esIngreso: boolean;
    monto: number;
    facturaId?: string;
  };
  movsDetalles: {
    metodoPago: medioDePago;
    monto: number;
    concepto?: string;
  }[];
  username?: string;
  password?: string;
  concepto?: string;
};

export async function crearMovimientoAndRevalidate({
  mov,
  movsDetalles,
  username,
  password,
  concepto,
}: ParamsMovimientos) {
  try {
    const response = await crearMovimiento({
      mov,
      movsDetalles,
      username,
      password,
      concepto,
    });
    if (response === undefined || typeof response === "string") {
      throw new Error(response);
    }
    if (response.error) {
      throw new Error(response.error);
    }
    const { success } = response;
    if (success) {
      console.log("entro");
      revalidatePath("/dashboard/caja/reportes/tiempoReal");
      return response;
    }
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}

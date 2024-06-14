"use server";

import { medioDePago } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import crearMovimiento from "./moduloCaja/movimiento/crearMovimiento";
import prisma from "./prisma";
import { LatestInvoice, Revenue } from "./definitions";
import { getMonthName } from "./utils";

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

export async function fetchCardData() {
  const { _sum, _count } = await prisma.factura.aggregate({
    _sum: {
      totalSaldoPagado: true,
      total: true,
    },
    _count: true,
  });
  const numberOfInvoices = Number(_count) || 0;
  const totalPaidInvoices = Number(_sum.totalSaldoPagado) || 0;
  const totalPendingInvoices = Number(_sum.total) - totalPaidInvoices || 0;
  const numberOfCustomers = await prisma.cliente.count();

  return {
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfCustomers,
  };
}

export async function fetchRevenue(): Promise<Revenue[]> {
  const rawRevenue = await prisma.factura.findMany({
    select: {
      fechaEmision: true,
      total: true,
    },
    where: {
      // Only include invoices that have been paid and one year old
      totalSaldoPagado: { gt: 0 },
      fechaEmision: {
        gt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      },
    },
    orderBy: { fechaEmision: "asc" },
  });
  // Use a map to aggregate revenue by month
  const revenueMap = new Map<string, number>();

  rawRevenue.forEach(({ fechaEmision, total }) => {
    const monthKey = `${fechaEmision.getFullYear()}-${(
      fechaEmision.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
    const currentRevenue = revenueMap.get(monthKey) ?? 0;
    revenueMap.set(monthKey, currentRevenue + total.toNumber());
  });

  // Convert the map to an array of Revenue objects
  const result: Revenue[] = Array.from(revenueMap.entries()).map(
    ([monthKey, revenue]) => {
      const [year, month] = monthKey.split("-");
      const monthIndex = parseInt(month, 10) - 1;
      const monthName = `${getMonthName(monthIndex)}`;
      return {
        month: monthName,
        revenue,
      };
    }
  );

  return result;
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  const latestInvoicesData = await prisma.factura.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      cliente: true,
      total: true,
      totalSaldoPagado: true,
      numeroFactura: true,
    },
  });
  const latestInvoices = latestInvoicesData.map((invoice) => ({
    id: invoice.id,
    name: invoice.cliente.nombre,
    ruc: invoice.cliente.docIdentidad,
    amount: invoice.total.toNumber(),
    invoiceNumber: invoice.numeroFactura,
    paymentStatus:
      +invoice.totalSaldoPagado === +invoice.total ? "pagado" : "pendiente",
  }));
  return latestInvoices;
}

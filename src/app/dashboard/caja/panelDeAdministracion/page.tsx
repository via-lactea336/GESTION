/* eslint-disable react/jsx-indent-props */
/* eslint-disable indent */

import CardWrapper from "@/components/dashboard/caja/CardWrapper";
import LatestInvoices from "@/components/dashboard/caja/LatestInvoices";
import RevenueChart from "@/components/dashboard/caja/RevenueChart";
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/components/dashboard/caja/skeleton/Skeletons";
import Header from "@/components/global/Header";
import Link from "next/link";
import { Suspense } from "react";

export default async function AdminPage() {
  const links = [
    { href: `/dashboard/caja`, text: "Cajas" },
    { href: `/dashboard/caja/historial`, text: "Historial" },
    { href: `/dashboard/caja/reportes`, text: "Reportes" },
  ];
  return (
    <main>
      <Header title="Panel de Administración" className="-mt-8 mb-8">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="bg-gray-800 py-1 px-2 rounded-md hover:text-primary-100 hover:bg-gray-900 mx-2"
          >
            {link.text}
          </Link>
        ))}
      </Header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}

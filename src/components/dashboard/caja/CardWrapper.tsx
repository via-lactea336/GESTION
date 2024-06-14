import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { fetchCardData } from "@/lib/actions";

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfCustomers,
  } = await fetchCardData();
  return (
    <>
      <Card title="Cobrado" value={totalPaidInvoices} type="collected" />
      <Card title="Pendiente" value={totalPendingInvoices} type="pending" />
      <Card
        title="Cantidad de Facturas"
        value={numberOfInvoices}
        type="invoices"
      />
      <Card
        title="Cantidad de Clientes"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-800 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-white" /> : null}
        <h3 className="ml-2 text-sm font-medium text-white">{title}</h3>
      </div>
      <p
        className={`
            truncate rounded-xl bg-[#542e9b] px-4 py-8 text-center text-2xl`}
      >
        {value.toLocaleString("es-PY")}{" "}
        {type === "collected" || type === "pending" ? "Gs" : ""}
      </p>
    </div>
  );
}

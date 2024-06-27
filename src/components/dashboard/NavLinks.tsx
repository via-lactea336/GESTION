"use client";
import useCookies from "@/lib/hooks/useCookies";
import {
  UserIcon,
  ChartPieIcon,
  ClipboardDocumentCheckIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const linksAdmin = [
  { name: "Panel", href: "/dashboard", icon: ChartPieIcon },
  { name: "Cuenta", href: "/dashboard/account", icon: UserIcon },

  {
    name: "Caja",
    href: "/dashboard/caja",
    icon: CircleStackIcon,
  },
  {
    name: "Asientos",
    href: "/dashboard/asiento",
    icon: ClipboardDocumentCheckIcon,
  },
];

const linksUser = [
  {
    name: "Caja",
    href: "/dashboard/caja",
    icon: CircleStackIcon,
  },
  { name: "Cuenta", href: "/dashboard/account", icon: UserIcon },
];

export default function NavLinks({ userRol }: { userRol: string }) {
  const pathname = usePathname();
  return (
    <>
      {userRol === "ADMIN"
        ? linksAdmin.map((link) => {
            const LinkIcon = link.icon;
            {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md  p-3 text-sm font-medium text-primary-400 hover:bg-gray-700 md:flex-none md:justify-start md:p-2 md:px-3 
              ${
                pathname === link.href
                  ? "bg-gray-700 text-primary-400"
                  : "bg-gray-800"
              }  
              `}
                >
                  <LinkIcon className="w-6" />
                  <p className="hidden md:block">{link.name}</p>
                </Link>
              );
            }
          })
        : linksUser.map((link) => {
            const LinkIcon = link.icon;
            {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md  p-3 text-sm font-medium text-primary-400 hover:bg-gray-700 md:flex-none md:justify-start md:p-2 md:px-3 
              ${
                pathname === link.href
                  ? "bg-gray-700 text-primary-400"
                  : "bg-gray-800"
              }  
              `}
                >
                  <LinkIcon className="w-6" />
                  <p className="hidden md:block">{link.name}</p>
                </Link>
              );
            }
          })}
    </>
  );
}

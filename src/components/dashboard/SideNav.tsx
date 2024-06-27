import Link from "next/link";
import NavLinks from "./NavLinks";
import Logo from "@/components/global/Logo";
import SignOutButton from "./SignOutButton";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SideNav() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-primary-800 p-4 md:h-40"
        href="/dashboard"
      >
        <div className="text-white md:w-40">
          <Logo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks userRol={session.user.rol} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-800 md:block"></div>
        <SignOutButton />
      </div>
    </div>
  );
}

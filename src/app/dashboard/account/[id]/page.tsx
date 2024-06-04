import Data from "@/components/dashboard/account/detalles/Data";
import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";

export default async function AccountDetailsTab() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <LoadingCirleIcon className="animate-spin" />;
  }

  return <Data userName={session.user.nombre} />;
}

import AcmeLogo from "@/components/global/Logo";
import LoginForm from "@/components/auth/login/LoginForm";
import Link from "next/link";
import RegisterForm from "@/components/auth/register/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="grid place-items-center h-screen">
      <div className="relative mx-auto flex w-full max-w-[540px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full justify-center items-center rounded-lg bg-primary-800 p-3 md:h-36">
          <div className="text-white">
            <AcmeLogo />
          </div>
        </div>
        <RegisterForm />
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-primary-200">
            Already have an account?
          </span>
          <Link href="/login">
            <span className="text-primary-500 text-xs uppercase font-semibold md:text-sm">
              Sign in
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

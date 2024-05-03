import AcmeLogo from "@/components/global/Logo";
import LoginForm from "@/components/auth/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid place-items-center h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full justify-center items-center rounded-lg bg-primary-800 p-3 md:h-36">
          <div className="text-white">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

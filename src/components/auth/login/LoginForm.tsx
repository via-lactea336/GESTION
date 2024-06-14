"use client";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Form } from "../Form";
import PasswordField from "../PasswordField";
import { login } from "@/lib/auth/login";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;
    const error = await login({ username, password });
    if (!error) {
      router.push("/dashboard/caja/panelDeAdministracion");
    } else {
      throw new Error(error);
    }
  };
  return (
    <Form
      title="Por favor, inicie sesión para continuar."
      handleSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <label className="text-primary-200" htmlFor="username">
          Nombre de usuario
        </label>
        <div className="relative">
          <input
            className="w-full bg-gray-700 rounded-lg py-[9px] pl-10"
            id="username"
            type="text"
            name="username"
            placeholder="Ingrese su nombre"
            autoComplete="name"
            required
          />
          <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300" />
        </div>
        <PasswordField
          label="Contraseña"
          name="password"
          placeholder="Contraseña"
          validate={false}
        />
      </div>
    </Form>
  );
}

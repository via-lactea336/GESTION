import { AtSymbolIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Form } from "../Form";
import PasswordField from "../PasswordField";
import { type } from "os";

export default function RegisterForm() {
  return (
    <Form title="Create an account to continue." type="Register">
      <div className="w-full grid grid-cols-1 gap-x-3 md:grid-cols-2">
        <div className="space-y-3 pt-3">
          <label className="text-primary-200" htmlFor="name">
            Name
          </label>
          <div className="relative">
            <input
              className="w-full bg-gray-700 rounded-lg py-[9px] pl-10"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300" />
          </div>
        </div>
        <div className="space-y-3 pt-3">
          <label className="text-primary-200" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <input
              className="w-full bg-gray-700 rounded-lg py-[9px] pl-10"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300" />
          </div>
        </div>
        <PasswordField
          label="Password"
          name="password"
          placeholder="Enter password"
          validate={true}
        />
        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm Password"
          validate={true}
        />
      </div>
    </Form>
  );
}

import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Form } from "../Form";
import PasswordField from "../PasswordField";

export default function LoginForm() {
  return (
    <Form title="Please log in to continue." type="Log in">
      <div className="space-y-3">
        <label className="text-primary-200" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            className="w-full bg-gray-700 rounded-lg py-[9px] pl-10"
            placeholder="Email"
          />
          <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300" />
        </div>
        <PasswordField
          label="Password"
          name="password"
          placeholder="Password"
          validate={false}
        />
      </div>
    </Form>
  );
}

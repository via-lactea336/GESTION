"use client";
import { KeyIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type PasswordFieldProps = {
  label: string;
  name: "password" | "confirmPassword";
  placeholder: string;
  validate?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordField({
  label,
  name,
  placeholder,
  validate,
  className,
  value,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="mb-3 mt-5 block text-primary-200" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          className={
            "w-full rounded-lg py-[9px] pl-10 pr-9 bg-gray-700 " + className
          }
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          required
          onChange={onChange}
          value={value}
          minLength={8}
          id={name}
          pattern={
            validate ? "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$" : undefined
          }
          title={
            validate
              ? "Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
              : undefined
          }
        />
        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300" />
        {!showPassword ? (
          <EyeIcon
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300 hover:cursor-pointer"
          />
        ) : (
          <EyeSlashIcon
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-300 hover:cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}

"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../global/Button";
import { Loading } from "../global/Loading";
import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function Form({ title, children, handleSubmit }: Props) {
  const errorInitialState = { message: "" };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorInitialState);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(e);
    } catch (error) {
      if (error instanceof Error) {
        setError({ message: error.message });
        setLoading(false);
      }
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="flex-1 rounded-lg bg-gray-800 px-6 pb-0 pt-8">
        <h1 className={`mb-3 text-2xl text-primary-200`}>{title}</h1>
        {children}
        <AuthButton loading={loading} buttonText={"Iniciar Sesión"} />
        <div className="flex h-12 items-center space-x-1 py-2">
          {error.message && (
            <p
              id="form-error"
              className="text-red-500 text-sm"
              aria-live="polite"
              aria-atomic="true"
            >
              <ExclamationCircleIcon className="h-5 w-5 inline" />
              <span className="ml-1 uppercase text-xs">{error.message}</span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

type ButtonProps = {
  loading: boolean;
  buttonText: string;
};

function AuthButton({ loading, buttonText }: ButtonProps) {
  return (
    <Button className="mt-6 w-full">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex items-center justify-between w-full">
          {buttonText}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </div>
      )}
    </Button>
  );
}

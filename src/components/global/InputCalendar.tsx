"use client";
import { useCalendar } from "@/lib/hooks/useCalendar";
import { useState } from "react";

type InputCalendarProps = {
  id: string;
  withTime?: boolean;
  required?: boolean;
  className?: string;
  value?: string;
  placeholder?: string;
  setValue?: (value: string) => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  limit?: Date;
  min?: string;
  disabled?:boolean,
};

export default function InputCalendar({
  id,
  required,
  className,
  value,
  setValue,
  handleChange,
  placeholder,
  withTime,
  limit,
  min,
  disabled
}: InputCalendarProps) {
  const { maxDate, maxDateTime } = useCalendar();
  const [error, setError] = useState<string>("");

  return withTime ? (
    <div>
      <input
        className={`${className} ${error && "border border-red-500"}`}
        id={id}
        name={id}
        type="datetime-local"
        required={required || false}
        max={maxDate}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          if (e.target.value.length < 0 || e.target.value.split("-").length < 3)
            return;
          if (new Date(e.currentTarget.value).toISOString() > new Date().toISOString()) {
            setError(`Por favor, seleccione una fecha válida.`);
          } else {
            setError("");
            setValue && setValue(e.currentTarget.value);
            handleChange && handleChange(e);
          }
        }}
      />
      {error && (
        <p title="mensaje de error" className="text-gray-200 text-sm">
          {error}
        </p>
      )}
    </div>
  ) : (
    <div>
      <input
        className={`${className} ${error && "border border-red-500"}`}
        id={id}
        name={id}
        type="date"
        disabled={disabled}
        required={required || false}
        max={maxDate}
        min={min}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          if (
            limit &&
            new Date(e.currentTarget.value).toISOString() > limit.toISOString()
          ) {
            setError(
              `Por favor, seleccione una fecha anterior a ${
                limit.toISOString().split("T")[0]
              }.`
            );
            return;
          }
          if (e.currentTarget.value > maxDate) {
            setError(`Por favor, seleccione una fecha válida.`);
          } else {
            setError("");
            setValue && setValue(e.currentTarget.value);
            handleChange && handleChange(e);
          }
        }}
      />
      {error && (
        <p title="mensaje de error" className="text-gray-200 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

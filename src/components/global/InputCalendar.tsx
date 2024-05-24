import { useCalendar } from "@/lib/hooks/useCalendar";
import { useState } from "react";

type InputCalendarProps = {
  id: string;
  required?: boolean;
  className?: string;
  value?: string;
  setValue?: (value: string) => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputCalendar({
  id,
  required,
  className,
  value,
  setValue,
  handleChange,
}: InputCalendarProps) {
  const { maxDate } = useCalendar();
  const [error, setError] = useState<string>("");

  return (
    <div>
      <input
        className={`${className} ${error && "border border-red-500"}`}
        id={id}
        name={id}
        type="date"
        required={required || false}
        max={maxDate}
        value={value}
        onChange={(e) => {
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

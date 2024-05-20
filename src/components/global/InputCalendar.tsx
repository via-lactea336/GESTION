import { useCalendar } from "@/lib/hooks/useCalendar";
import { useState } from "react";

type InputCalendarProps = {
  id: string;
  required?: boolean;
  className?: string;
};

export default function InputCalendar({
  id,
  required,
  className,
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
        onChange={(e) => {
          if (e.currentTarget.value > maxDate) {
            setError(`Por favor, seleccione una fecha válida.`);
          } else {
            setError("");
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

"use client";

type InputProps = {
  id: string;
  required?: boolean;
  className: string;
  type: "text" | "number" | "formattedNumber";
  placeholder: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onkeydown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
};

export default function Input({
  id,
  required,
  className,
  type,
  placeholder,
  value,
  onChange,
  onkeydown,
  error,
  disabled,
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Bloquear caracteres no permitidos
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Delete"
    ) {
      e.preventDefault();
    }
  };

  const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, "");

    // Validar que el valor es un número
    if (/^\d*$/.test(rawValue)) {
      onChange && onChange({ ...e, target: { ...e.target, value: rawValue } });
    }
  };

  const formatted =
    value === 0 ? "" : (value as number)?.toLocaleString("es-PY");
  const val = type === "formattedNumber" ? formatted : value;

  return (
    <div>
      <input
        className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className} ${
          error ? "border border-red-500" : ""
        } ${disabled ? "cursor-not-allowed" : ""}`}
        id={id}
        name={id}
        type={type === "formattedNumber" ? "text" : type}
        placeholder={disabled ? "" : placeholder}
        disabled={disabled || false}
        value={val}
        required={required || false}
        min={type === "number" ? 1 : undefined}
        onChange={type === "formattedNumber" ? handleFormattedChange : onChange}
        onKeyDown={
          type === "formattedNumber" || type === "number"
            ? handleKeyDown
            : onkeydown
        }
      />
      {error && (
        <p title="mensaje de error" className="text-gray-200 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

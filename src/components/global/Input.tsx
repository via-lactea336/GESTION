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
    if (e.key === "-" || e.key === "+" || e.key === "e") {
      e.preventDefault();
    }
  };

  const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (onChange) {
      e.target.value = formattedValue;
      onChange(e);
    }
  };

  return (
    <div>
      <input
        className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className} ${
          error && "border border-red-500"
        } ${disabled && "cursor-not-allowed"}`}
        id={id}
        name={id}
        type={type === "formattedNumber" ? "text" : type}
        placeholder={disabled ? "" : placeholder}
        disabled={disabled || false}
        value={value}
        required={required || false}
        min={type === "number" ? 1 : undefined}
        onChange={type === "formattedNumber" ? handleFormattedChange : onChange}
        onKeyDown={type === "number" ? handleKeyDown : onkeydown}
      />
      {error && (
        <p title="mensaje de error" className="text-gray-200 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

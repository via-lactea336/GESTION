"use client";
type InputProps = {
  id: string;
  required?: boolean;
  className: string;
  type: "text" | "number";
  placeholder: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onkeydown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
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
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "+" || e.key === "e") {
      e.preventDefault();
    }
  };
  return (
    <div>
      <input
        className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className} ${
          error && "border border-red-500"
        }`}
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required || false}
        min={type === "number" ? 1 : undefined}
        onChange={onChange}
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

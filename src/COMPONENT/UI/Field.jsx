import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  children,
  className = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const showError = touched && error;
  const isPassword = type === "password";
  const inputType = isPassword ? (visible ? "text" : "password") : type;
  const inputClasses = `w-full rounded-[12px] border px-3 py-2.5 text-base outline-none transition-colors ${
    showError
      ? "border-[#8B3A2F]"
      : "border-[#D5DFD9] focus:border-[#1F5C45]"
  } bg-white text-[#1C211E] ${isPassword ? "pe-11" : ""}`;

  const describedBy = showError ? `${name}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-[0.8125rem] font-medium text-[#3F5349]">
          {label}
        </label>
      )}

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy}
          {...props}
        >
          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${inputClasses} min-h-[100px] resize-y`}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy}
          {...props}
        />
      ) : (
        <div className={isPassword ? "relative" : undefined}>
          <input
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={inputClasses}
            aria-invalid={showError || undefined}
            aria-describedby={describedBy}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 end-0 flex min-w-11 items-center justify-center text-[#3F5349] hover:text-[#1F5C45]"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
            >
              {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
      )}

      {showError && (
        <p id={`${name}-error`} className="text-sm text-[#8B3A2F]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

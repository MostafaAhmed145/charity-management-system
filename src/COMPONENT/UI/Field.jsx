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
  const showError = touched && error;
  const inputClasses = `w-full rounded-[12px] border px-3 py-2.5 text-base outline-none transition-colors ${
    showError
      ? "border-[#8B3A2F]"
      : "border-[#D5DFD9] focus:border-[#1F5C45]"
  } bg-white text-[#1C211E]`;

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
          aria-describedby={showError ? `${name}-error` : undefined}
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
          aria-describedby={showError ? `${name}-error` : undefined}
          {...props}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? `${name}-error` : undefined}
          {...props}
        />
      )}

      {showError && (
        <p id={`${name}-error`} className="text-sm text-[#8B3A2F]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

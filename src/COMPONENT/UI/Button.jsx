import { LoaderCircle } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-[#1F5C45] text-[#F4F4F2] hover:bg-[#143D2E] disabled:opacity-50",
  secondary:
    "bg-white text-[#1F5C45] border border-[#B7C9BE] hover:bg-[#E6EEE9] disabled:opacity-50",
  danger:
    "bg-white text-[#8B3A2F] border border-[#D5DFD9] hover:bg-[#F4F4F2] disabled:opacity-50",
};

export function Button({
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[12px] px-4 py-2 text-sm font-medium transition-colors ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
      {...props}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

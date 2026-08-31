import { getStatus } from "../../lib/status.js";

export function StatusBadge({ status }) {
  const { text, className, icon: Icon } = getStatus(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {text}
    </span>
  );
}

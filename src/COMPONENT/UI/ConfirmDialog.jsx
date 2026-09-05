import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "./Button.jsx";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = "تأكيد",
  danger = false,
}) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) setBusy(false);
  }, [open]);

  return (
    <Dialog open={open} onClose={busy ? () => {} : onClose} className="relative z-[70]">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-[14px] border border-[#D5DFD9] bg-white p-6 shadow-lg">
          <DialogTitle className="font-heading text-xl font-bold leading-normal text-[#1C211E]">
            {title}
          </DialogTitle>
          {body && (
            <p className="mt-3 text-sm leading-relaxed text-[#3F5349]">{body}</p>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" type="button" disabled={busy} onClick={onClose}>
              إلغاء
            </Button>
            <Button
              variant={danger ? "danger" : "primary"}
              type="button"
              loading={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await onConfirm();
                  onClose();
                } catch {
                  setBusy(false);
                }
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

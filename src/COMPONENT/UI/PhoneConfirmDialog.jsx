import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Pencil } from "lucide-react";
import { Button } from "./Button.jsx";
import { Field } from "./Field.jsx";
import { isValidPhone, MSG } from "../../lib/validation.js";

export function PhoneConfirmDialog({
  open,
  onClose,
  phone,
  onConfirm,
  loading = false,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setEditing(false);
    setDraft(phone || "");
    setTouched(false);
    setError("");
  }, [open, phone]);

  const current = editing ? draft.trim() : String(phone ?? "").trim();

  const submit = async () => {
    if (editing) {
      setTouched(true);
      if (!isValidPhone(current)) {
        setError(MSG.phone);
        return;
      }
    }
    await onConfirm(current);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[70]">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-[14px] border border-[#D5DFD9] bg-white p-6 shadow-lg">
          <DialogTitle className="font-heading text-xl font-bold leading-normal text-[#1C211E]">
            تأكيد رقم الموبايل
          </DialogTitle>
          <p className="mt-3 text-sm leading-relaxed text-[#3F5349]">
            راجع الرقم. لو محتاج تعديل، اضغط القلم.
          </p>

          {editing ? (
            <div className="mt-4">
              <Field
                label="رقم الموبايل"
                name="confirmPhone"
                type="tel"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setError("");
                }}
                onBlur={() => setTouched(true)}
                error={error}
                touched={touched}
                autoComplete="tel"
              />
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#E6EEE9] px-3 py-2">
              <p
                className="flex-1 text-center text-xl font-bold tracking-wide text-[#1C211E]"
                dir="ltr"
              >
                {phone}
              </p>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[12px] text-[#1F5C45] hover:bg-white"
                onClick={() => {
                  setDraft(phone || "");
                  setEditing(true);
                  setError("");
                }}
                aria-label="تعديل الرقم"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" type="button" onClick={onClose}>
              رجوع
            </Button>
            <Button type="button" loading={loading} onClick={submit}>
              تأكد الطلب
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

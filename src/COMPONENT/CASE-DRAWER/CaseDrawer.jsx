import { useEffect } from "react";
import { Button } from "../UI/Button.jsx";
import { StatusBadge } from "../UI/StatusBadge.jsx";

export default function CaseDrawer({ open, onClose, selectedCase, onEdit, onArchive }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !selectedCase) return null;

  const rows = [
    ["الاسم", selectedCase.userName],
    ["الهاتف", selectedCase.phone],
    ["العنوان", selectedCase.address],
    ["الرقم القومي", selectedCase.nationalId],
    ["التصنيف", selectedCase.caseType],
    ["نوع المساعدة", selectedCase.supportType],
    ["ملاحظات", selectedCase.notes || "لا توجد"],
  ];

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[50] bg-black/40 lg:hidden"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <aside
        className="fixed inset-x-0 bottom-0 z-[60] max-h-[80vh] overflow-y-auto rounded-t-[14px] border border-[#D5DFD9] bg-white p-5 lg:inset-x-auto lg:inset-y-16 lg:right-[var(--hidaya-sidebar)] lg:left-auto lg:h-[calc(100vh-4rem)] lg:max-h-none lg:w-[var(--hidaya-drawer)] lg:rounded-none lg:border-t-0"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-ruqaa text-xl text-[#1C211E]">{selectedCase.userName}</h2>
            <div className="mt-2">
              <StatusBadge status={selectedCase.status} />
            </div>
          </div>
          <Button variant="secondary" onClick={onClose}>إغلاق</Button>
        </div>
        <dl className="space-y-3 text-sm">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[#3F5349]">{label}</dt>
              <dd className="font-medium text-[#1C211E]">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={() => onEdit(selectedCase)}>تعديل</Button>
          <Button variant="danger" onClick={() => onArchive(selectedCase)}>نقل للأرشيف</Button>
        </div>
      </aside>
    </>
  );
}

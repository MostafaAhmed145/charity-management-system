import { Button } from "../UI/Button.jsx";
import { Field } from "../UI/Field.jsx";
import { StatusBadge } from "../UI/StatusBadge.jsx";

export default function CaseDrawer({
  selectedCase,
  onClose,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  onStatusChange,
  mode = "active",
}) {
  if (!selectedCase) return null;

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
    <div className="rounded-xl border border-hidaya-line bg-hidaya-body p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg font-bold text-hidaya-ink">{selectedCase.userName}</p>
          <div className="mt-2">
            <StatusBadge status={selectedCase.status} />
          </div>
        </div>
        <Button variant="secondary" onClick={onClose}>
          طيّ التفاصيل
        </Button>
      </div>

      {mode === "active" && onStatusChange ? (
        <div className="mb-4 max-w-xs">
          <Field
            label="تغيير الحالة"
            name={`status-${selectedCase.id}`}
            type="select"
            value={selectedCase.status || "pending"}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="pending">قيد المراجعة</option>
            <option value="in_progress">جاري التنفيذ</option>
            <option value="completed">مكتملة</option>
            <option value="rejected">مرفوضة</option>
          </Field>
        </div>
      ) : null}

      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label} className={label === "ملاحظات" ? "sm:col-span-2 lg:col-span-3" : ""}>
            <dt className="text-[0.8125rem] text-hidaya-muted">{label}</dt>
            <dd className="mt-0.5 font-medium text-hidaya-ink">{value || "—"}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-col gap-2 border-t border-hidaya-line pt-4 sm:flex-row">
        {mode === "active" ? (
          <>
            <Button onClick={() => onEdit(selectedCase)}>تعديل</Button>
            <Button variant="danger" onClick={() => onArchive(selectedCase)}>
              نقل للأرشيف
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => onRestore(selectedCase)}>
              استعادة
            </Button>
            {onDelete ? (
              <Button variant="danger" onClick={() => onDelete(selectedCase)}>
                حذف نهائي
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

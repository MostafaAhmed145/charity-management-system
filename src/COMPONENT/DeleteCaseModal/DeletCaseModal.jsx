import { ConfirmDialog } from "../UI/ConfirmDialog.jsx";

export default function DeletCaseModal({
  openDeletCase,
  setOpenDeletCase,
  handleDelete,
  id,
  selectedCase,
}) {
  return (
    <ConfirmDialog
      open={openDeletCase}
      onClose={() => setOpenDeletCase(false)}
      onConfirm={() => handleDelete(id)}
      title="نقل للأرشيف"
      body={`هتنقل حالة ${selectedCase?.userName || ""} للأرشيف. تقدر تسترجعها بعدين.`}
      confirmLabel="نقل"
      danger
    />
  );
}

import { ConfirmDialog } from "../UI/ConfirmDialog.jsx";

export default function ChangeRoleModal({
  open,
  setOpen,
  selectedUser,
  changeRole,
  loading,
}) {
  if (!selectedUser) return null;

  const isAdmin = selectedUser.role === "admin";

  return (
    <ConfirmDialog
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={changeRole}
      title="تغيير الصلاحية"
      body={`هتغير صلاحية ${selectedUser.name || "الحساب"} من ${
        isAdmin ? "مشرف" : "مستخدم"
      } لـ ${isAdmin ? "مستخدم" : "مشرف"}.`}
      confirmLabel={loading ? "جاري التغيير..." : "تأكيد"}
    />
  );
}

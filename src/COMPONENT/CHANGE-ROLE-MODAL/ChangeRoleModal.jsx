import React from "react";
import { ShieldCheck, Users, X } from "lucide-react";

export default function ChangeRoleModal({
  open,
  setOpen,
  selectedUser,
  changeRole,
  loading,
}) {
  if (!open || !selectedUser) return null;

  const isAdmin = selectedUser.role === "admin";

  const currentRole = isAdmin ? "مشرف" : "مستخدم";
  const newRole = isAdmin ? "مستخدم" : "مشرف";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              تغيير صلاحية الحساب
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              تعديل صلاحية المستخدم
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}
        <div className="p-5">

          {/* User */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">

            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {selectedUser.name?.charAt(0) || "؟"}
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                {selectedUser.name || "غير متوفر"}
              </p>

              <p className="text-sm text-gray-500">
                {selectedUser.email || "غير متوفر"}
              </p>
            </div>

          </div>

          {/* Change Info */}
          <div className="mt-5">

            <p className="text-gray-600 text-sm mb-3">
              هل تريد تغيير صلاحية الحساب؟
            </p>

            <div className="flex items-center gap-3">

              {/* Current Role */}
              <div className="flex-1 border rounded-xl p-4 text-center">

                {isAdmin ? (
                  <ShieldCheck
                    className="mx-auto text-blue-600"
                    size={25}
                  />
                ) : (
                  <Users
                    className="mx-auto text-gray-500"
                    size={25}
                  />
                )}

                <p className="text-xs text-gray-500 mt-2">
                  الصلاحية الحالية
                </p>

                <p className="font-bold mt-1">
                  {currentRole}
                </p>

              </div>

              <span className="text-gray-400 text-xl">
                ←
              </span>

              {/* New Role */}
              <div className="flex-1 border border-blue-200 bg-blue-50 rounded-xl p-4 text-center">

                {isAdmin ? (
                  <Users
                    className="mx-auto text-gray-600"
                    size={25}
                  />
                ) : (
                  <ShieldCheck
                    className="mx-auto text-blue-600"
                    size={25}
                  />
                )}

                <p className="text-xs text-gray-500 mt-2">
                  الصلاحية الجديدة
                </p>

                <p className="font-bold mt-1 text-blue-600">
                  {newRole}
                </p>

              </div>

            </div>

            {/* Warning */}
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 text-yellow-700 text-sm">
              سيتم تغيير صلاحية هذا الحساب بعد الضغط على تأكيد التغيير.
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t">

          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          >
            إلغاء
          </button>

          <button
            onClick={changeRole}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "جاري التغيير..." : "تأكيد التغيير"}
          </button>

        </div>

      </div>

    </div>
  );
}
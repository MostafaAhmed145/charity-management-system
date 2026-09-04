import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { Button } from "../UI/Button.jsx";
import { ConfirmDialog } from "../UI/ConfirmDialog.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import {
  deleteUserAccountSecure,
  setUserRoleSecure,
} from "../../lib/secureOps.js";
import { MSG } from "../../lib/validation.js";

function roleLabel(role) {
  if (role === "admin") return "مشرف";
  if (role === "superAdmin") return "مسؤول أعلى";

  return "مستخدم";
}

export default function SuperAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleUser, setRoleUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  useEffect(() => {
    document.title = "المسؤولون — جمعية الهداية";
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));

        const usersData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Get users error:", error);
        toast.error(MSG.network);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  // استبعاد المسؤول الأعلى من الجدول
  const displayedUsers = users.filter(
    (item) => item.role !== "superAdmin"
  );

  // عدد المشرفين
  const admins = users.filter(
    (item) => item.role === "admin"
  );

  // عدد المستخدمين العاديين
  const normalUsers = users.filter(
    (item) => item.role === "user"
  );

  // تغيير صلاحية المستخدم
  const changeRole = async () => {
    if (!roleUser) return;

    const newRole =
      roleUser.role === "admin"
        ? "user"
        : "admin";

    try {
      await setUserRoleSecure(
        roleUser.id,
        newRole
      );

      setUsers((prev) =>
        prev.map((item) =>
          item.id === roleUser.id
            ? {
                ...item,
                role: newRole,
              }
            : item
        )
      );

      setRoleUser(null);

      toast.success(
        "تم تغيير صلاحية الحساب بنجاح"
      );
    } catch (error) {
      console.error(
        "Change role error:",
        error
      );

      toast.error(MSG.network);
    }
  };

  // حذف الحساب
  const removeAccount = async () => {
    if (!deleteUser) return;

    try {
      await deleteUserAccountSecure(
        deleteUser.id
      );

      setUsers((prev) =>
        prev.filter(
          (item) =>
            item.id !== deleteUser.id
        )
      );

      setDeleteUser(null);

      toast.success(
        "تم حذف الحساب بنجاح"
      );
    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      toast.error(MSG.network);
    }
  };

  return (
    <>
      {/* عنوان الصفحة */}
      <header className="border-b border-[#D5DFD9] pb-4 mt-12">
        <PageHeading>
          المسؤولون
        </PageHeading>

        <p className="mt-1 text-sm text-[#3F5349]">
          إدارة الحسابات والصلاحيات
        </p>
      </header>

      {/* الإحصائيات */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-4">
          <p className="text-sm text-[#3F5349]">
            إجمالي المشرفين
          </p>

          <p className="mt-1 text-2xl font-bold text-[#1C211E]">
            {admins.length}
          </p>
        </div>

        <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-4">
          <p className="text-sm text-[#3F5349]">
            إجمالي المستخدمين
          </p>

          <p className="mt-1 text-2xl font-bold text-[#1C211E]">
            {normalUsers.length}
          </p>
        </div>
      </div>

      {/* حالة التحميل */}
      {loading && (
        <div className="mt-6 space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-[#E6EEE9]"
            />
          ))}
        </div>
      )}

      {/* لا توجد حسابات */}
      {!loading &&
        displayedUsers.length === 0 && (
          <div className="mt-6 rounded-[14px] border border-[#D5DFD9] bg-white p-8 text-center text-[#3F5349]">
            لا توجد حسابات لعرضها حاليًا.
          </div>
        )}

      {/* جدول الحسابات */}
      {!loading &&
        displayedUsers.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-[14px] border border-[#D5DFD9] bg-white">
            <table className="min-w-full text-right text-sm">
              <thead className="bg-[#E6EEE9] text-[#3F5349]">
                <tr>
                  <th className="px-4 py-3">
                    الاسم
                  </th>

                  <th className="px-4 py-3">
                    البريد الإلكتروني
                  </th>

                  <th className="px-4 py-3">
                    رقم الهاتف
                  </th>

                  <th className="px-4 py-3">
                    الصلاحية
                  </th>

                  <th className="px-4 py-3">
                    الإجراءات
                  </th>
                </tr>
              </thead>

              <tbody>
                {displayedUsers.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#E6EEE9]"
                    >
                      <td className="px-4 py-3">
                        {item.name ||
                          "غير متوفر"}
                      </td>

                      <td className="px-4 py-3">
                        {item.email ||
                          "غير متوفر"}
                      </td>

                      <td className="px-4 py-3">
                        {item.phone ||
                          "غير مسجّل"}
                      </td>

                      <td className="px-4 py-3">
                        {roleLabel(
                          item.role
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setRoleUser(
                                item
                              )
                            }
                          >
                            تغيير الصلاحية
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              setDeleteUser(
                                item
                              )
                            }
                          >
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      {/* تأكيد تغيير الصلاحية */}
      <ConfirmDialog
        open={Boolean(roleUser)}
        onClose={() =>
          setRoleUser(null)
        }
        onConfirm={changeRole}
        title="تغيير الصلاحية"
        body={
          roleUser
            ? `هل أنت متأكد من تغيير صلاحية ${
              
                roleUser.name ||
                "هذا الحساب"
              } من ${roleLabel(
                roleUser.role
              )} إلى ${
                roleUser.role ===
                "admin"
                  ? "مستخدم"
                  : "مشرف"
              }؟`
            : ""
        }
        confirmLabel="تأكيد"
      />

      {/* تأكيد حذف الحساب */}
      <ConfirmDialog
        open={Boolean(deleteUser)}
        onClose={() =>
          setDeleteUser(null)
        }
        onConfirm={removeAccount}
        title="حذف الحساب"
        body={
          deleteUser
            ? `هل أنت متأكد من حذف حساب ${
                deleteUser.name ||
                "هذا المستخدم"
              } نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.`
            : ""
        }
        confirmLabel="حذف الحساب"
        danger
      />
    </>
  );
}
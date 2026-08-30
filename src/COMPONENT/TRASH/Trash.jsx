import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { Button } from "../UI/Button.jsx";
import { ConfirmDialog } from "../UI/ConfirmDialog.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import { StatusBadge } from "../UI/StatusBadge.jsx";
import { MSG } from "../../lib/validation.js";

export default function Trash() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    document.title = "الأرشيف — جمعية الهداية";
  }, []);

  useEffect(() => {
    const getArchivedCases = async () => {
      try {
        const q = query(collection(db, "cases"), where("archived", "==", true));
        const snapshot = await getDocs(q);
        setCases(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
      } catch {
        toast.error(MSG.network);
      } finally {
        setLoading(false);
      }
    };
    getArchivedCases();
  }, []);

  const restoreCase = async (id) => {
    try {
      await updateDoc(doc(db, "cases", id), { archived: false });
      setCases((prev) => prev.filter((item) => item.id !== id));
      toast.success("تم استعادة الحالة");
    } catch {
      toast.error(MSG.network);
    }
  };

  const deleteCase = async () => {
    if (!pendingDelete) return;
    try {
      await deleteDoc(doc(db, "cases", pendingDelete.id));
      setCases((prev) => prev.filter((item) => item.id !== pendingDelete.id));
      toast.success("تم حذف الحالة");
    } catch {
      toast.error(MSG.network);
    }
  };

  return (
    <>
      <header className="border-b border-[#D5DFD9] pb-4">
        <PageHeading>الأرشيف</PageHeading>
      </header>

      {loading && (
        <div className="mt-6 space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-[#E6EEE9]" />
          ))}
        </div>
      )}

      {!loading && cases.length === 0 && (
        <div className="mt-6 rounded-[14px] border border-[#D5DFD9] bg-white p-8 text-center text-[#3F5349]">
          الأرشيف فاضي. ما فيش حالات منقولة هنا.
        </div>
      )}

      {!loading && cases.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-[14px] border border-[#D5DFD9] bg-white">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-[#E6EEE9] text-[#3F5349]">
              <tr>
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">التصنيف</th>
                <th className="px-4 py-3">نوع المساعدة</th>
                <th className="px-4 py-3">الهاتف</th>
                <th className="px-4 py-3">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.id} className="border-t border-[#E6EEE9]">
                  <td className="px-4 py-3">{item.userName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">{item.caseType}</td>
                  <td className="px-4 py-3">{item.supportType}</td>
                  <td className="px-4 py-3">{item.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button variant="secondary" onClick={() => restoreCase(item.id)}>
                        استعادة
                      </Button>
                      <Button variant="danger" onClick={() => setPendingDelete(item)}>
                        حذف نهائي
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={deleteCase}
        title="حذف نهائي"
        body="الحذف نهائي ومش هيرجع. متأكد؟"
        confirmLabel="حذف"
        danger
      />
    </>
  );
}

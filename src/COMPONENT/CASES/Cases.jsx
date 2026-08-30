import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import CaseModal from "../CASE-MODAL/CaseModal";
import CaseDrawer from "../CASE-DRAWER/CaseDrawer";
import { ConfirmDialog } from "../UI/ConfirmDialog.jsx";
import { Button } from "../UI/Button.jsx";
import { StatusBadge } from "../UI/StatusBadge.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import { MSG } from "../../lib/validation.js";

export default function Cases() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "الحالات — جمعية الهداية";
  }, []);

  const getCases = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cases"));
      const data = querySnapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((item) => item.archived !== true);
      setCases(data);
    } catch {
      toast.error(MSG.network);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCases();
  }, []);

  const handleArchive = async () => {
    if (!selectedCase?.id) return;
    try {
      await updateDoc(doc(db, "cases", selectedCase.id), { archived: true });
      setCases((prev) => prev.filter((item) => item.id !== selectedCase.id));
      setDrawerOpen(false);
      setSelectedCase(null);
      toast.success("تم نقل الحالة إلى الأرشيف");
    } catch {
      toast.error(MSG.network);
    }
  };

  const filteredCases = cases.filter((item) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      item.userName?.toLowerCase().includes(searchTerm) ||
      item.nationalId?.includes(searchTerm) ||
      item.phone?.includes(searchTerm);
    const matchesStatus =
      sortStatus === "" || sortStatus === "all" || item.status === sortStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <header className="border-b border-[#D5DFD9] pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <PageHeading>الحالات</PageHeading>
          <Button
            onClick={() => {
              setSelectedCase(null);
              setOpen(true);
            }}
          >
            إضافة حالة
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <select
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
            className="rounded-[12px] border border-[#D5DFD9] bg-white px-3 py-2.5"
          >
            <option value="">فرز حسب الحالة</option>
            <option value="all">كل الحالات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="in_progress">جاري التنفيذ</option>
            <option value="completed">مكتملة</option>
            <option value="rejected">مرفوضة</option>
          </select>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو الرقم القومي"
            className="w-full rounded-[12px] border border-[#D5DFD9] px-3 py-2.5 md:w-80"
          />
        </div>
      </header>

      {loading && (
        <div className="mt-6 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-[#E6EEE9]" />
          ))}
        </div>
      )}

      {!loading && filteredCases.length === 0 && (
        <div className="mt-6 rounded-[14px] border border-[#D5DFD9] bg-white p-8 text-center">
          <p className="mb-4 text-[#3F5349]">
            {search || sortStatus ? "ما فيش حالات تطابق البحث" : "ما فيش حالات بعد"}
          </p>
          {(search || sortStatus) && (
            <Button variant="secondary" onClick={() => { setSearch(""); setSortStatus(""); }}>
              تصفير الفلتر
            </Button>
          )}
        </div>
      )}

      {!loading && filteredCases.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-[14px] border border-[#D5DFD9] bg-white">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-[#E6EEE9] text-[#3F5349]">
              <tr>
                <th className="px-4 py-3">م</th>
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">الرقم القومي</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">التصنيف</th>
                <th className="px-4 py-3">نوع المساعدة</th>
                <th className="px-4 py-3">الهاتف</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item, index) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-t border-[#E6EEE9] hover:bg-[#F4F4F2]"
                  onClick={() => {
                    setSelectedCase(item);
                    setDrawerOpen(true);
                  }}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.userName}</td>
                  <td className="px-4 py-3">{item.nationalId}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3">{item.caseType}</td>
                  <td className="px-4 py-3">{item.supportType}</td>
                  <td className="px-4 py-3">{item.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CaseModal
        open={open}
        setOpen={setOpen}
        selectedCase={selectedCase}
        getCases={getCases}
        setSelectedCase={setSelectedCase}
      />
      <CaseDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedCase={selectedCase}
        onEdit={() => {
          setDrawerOpen(false);
          setOpen(true);
        }}
        onArchive={() => setConfirmOpen(true)}
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleArchive}
        title="نقل للأرشيف"
        body="هتنقل الحالة للأرشيف. تقدر تسترجعها بعدين."
        confirmLabel="نقل"
        danger
      />
    </>
  );
}

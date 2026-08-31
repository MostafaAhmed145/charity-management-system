import { Fragment, useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { ChevronDown } from "lucide-react";
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
  const [expandedId, setExpandedId] = useState(null);
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

  useEffect(() => {
    if (!expandedId) return;
    const onKey = (e) => {
      if (e.key === "Escape") setExpandedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId]);

  const selected = cases.find((item) => item.id === expandedId) || selectedCase;

  const toggleRow = (item) => {
    setSelectedCase(item);
    setExpandedId((current) => (current === item.id ? null : item.id));
  };

  const handleStatusChange = async (status) => {
    if (!selected?.id) return;
    try {
      await updateDoc(doc(db, "cases", selected.id), { status });
      setSelectedCase((prev) => (prev ? { ...prev, status } : prev));
      setCases((prev) =>
        prev.map((item) => (item.id === selected.id ? { ...item, status } : item))
      );
      toast.success("تم تحديث الحالة");
    } catch {
      toast.error(MSG.network);
    }
  };

  const handleArchive = async () => {
    if (!selected?.id) return;
    try {
      await updateDoc(doc(db, "cases", selected.id), { archived: true });
      setCases((prev) => prev.filter((item) => item.id !== selected.id));
      setExpandedId(null);
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
      <header className="border-b border-hidaya-line pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <PageHeading>الحالات</PageHeading>
            <p className="mt-1 text-sm text-hidaya-muted">
              {loading ? "بتحميل الحالات" : `${filteredCases.length} حالة — اضغط الصف عشان التفاصيل تكبر هنا`}
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedCase(null);
              setExpandedId(null);
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
            className="rounded-xl border border-hidaya-line bg-white px-3 py-2.5"
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
            className="w-full rounded-xl border border-hidaya-line px-3 py-2.5 md:w-80"
          />
        </div>
      </header>

      {loading && (
        <div className="mt-6 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-hidaya-tint" />
          ))}
        </div>
      )}

      {!loading && filteredCases.length === 0 && (
        <div className="mt-6 rounded-[14px] border border-hidaya-line bg-white p-8 text-center">
          <p className="mb-4 text-hidaya-muted">
            {search || sortStatus ? "ما فيش حالات تطابق البحث" : "ما فيش حالات بعد"}
          </p>
          {(search || sortStatus) && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setSortStatus("");
              }}
            >
              تصفير الفلتر
            </Button>
          )}
        </div>
      )}

      {!loading && filteredCases.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-[14px] border border-hidaya-line bg-white">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-hidaya-tint text-hidaya-muted">
              <tr>
                <th className="px-4 py-3 font-medium">م</th>
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">الرقم القومي</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">التصنيف</th>
                <th className="px-4 py-3 font-medium">نوع المساعدة</th>
                <th className="px-4 py-3 font-medium">الهاتف</th>
                <th className="w-12 px-3 py-3">
                  <span className="sr-only">تفاصيل</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item, index) => {
                const expanded = expandedId === item.id;
                return (
                  <Fragment key={item.id}>
                    <tr
                      className={`cursor-pointer border-t border-hidaya-tint transition-colors duration-200 ${
                        expanded ? "bg-hidaya-tint" : "hover:bg-hidaya-body"
                      }`}
                      onClick={() => toggleRow(item)}
                      aria-expanded={expanded}
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-hidaya-ink">{item.userName}</td>
                      <td className="px-4 py-3">{item.nationalId}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3">{item.caseType}</td>
                      <td className="px-4 py-3">{item.supportType}</td>
                      <td className="px-4 py-3">{item.phone}</td>
                      <td className="px-3 py-3">
                        <ChevronDown
                          className={`h-5 w-5 text-hidaya-muted transition-transform duration-200 ${
                            expanded ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </td>
                    </tr>
                    {expanded ? (
                      <tr className="border-t border-hidaya-line bg-hidaya-tint/60">
                        <td colSpan={8} className="px-4 py-4">
                          <CaseDrawer
                            selectedCase={item.status === selected?.status ? selected : item}
                            onClose={() => setExpandedId(null)}
                            onEdit={() => {
                              setSelectedCase(item);
                              setExpandedId(null);
                              setOpen(true);
                            }}
                            onArchive={() => {
                              setSelectedCase(item);
                              setConfirmOpen(true);
                            }}
                            onStatusChange={handleStatusChange}
                          />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
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

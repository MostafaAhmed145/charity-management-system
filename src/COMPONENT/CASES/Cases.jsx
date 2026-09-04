import { Fragment, useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { ChevronDown, Search, Filter } from "lucide-react";
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

  // ================= RESPONSIVE =================

  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < 640
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ================= PAGE TITLE =================

  useEffect(() => {
    document.title = "الحالات — جمعية الهداية";
  }, []);

  // ================= GET CASES =================

  const getCases = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(
        collection(db, "cases")
      );

      const data = querySnapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
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

  // ================= ESC CLOSE =================

  useEffect(() => {
    if (!expandedId) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setExpandedId(null);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [expandedId]);

  // ================= SELECTED CASE =================

  const selected =
    cases.find((item) => item.id === expandedId) ||
    selectedCase;

  // ================= TOGGLE ROW =================

  const toggleRow = (item) => {
    setSelectedCase(item);

    setExpandedId((current) =>
      current === item.id ? null : item.id
    );
  };

  // ================= CHANGE STATUS =================

  const handleStatusChange = async (status) => {
    if (!selected?.id) return;

    try {
      await updateDoc(
        doc(db, "cases", selected.id),
        { status }
      );

      setSelectedCase((prev) =>
        prev ? { ...prev, status } : prev
      );

      setCases((prev) =>
        prev.map((item) =>
          item.id === selected.id
            ? { ...item, status }
            : item
        )
      );

      toast.success("تم تحديث الحالة");
    } catch {
      toast.error(MSG.network);
    }
  };

  // ================= ARCHIVE =================

  const handleArchive = async () => {
    if (!selected?.id) return;

    try {
      await updateDoc(
        doc(db, "cases", selected.id),
        { archived: true }
      );

      setCases((prev) =>
        prev.filter((item) => item.id !== selected.id)
      );

      setExpandedId(null);
      setSelectedCase(null);

      toast.success("تم نقل الحالة إلى الأرشيف");
    } catch {
      toast.error(MSG.network);
    }
  };

  // ================= FILTER =================

  const filteredCases = cases.filter((item) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      item.userName?.toLowerCase().includes(searchTerm) ||
      item.nationalId?.includes(searchTerm) ||
      item.phone?.includes(searchTerm);

    const matchesStatus =
      sortStatus === "" ||
      sortStatus === "all" ||
      item.status === sortStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-w-0 max-w-full">
      {/* ================= HEADER ================= */}

      <header className="mb-6 mt-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Title */}

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <PageHeading>الحالات</PageHeading>

              {!loading && (
                <span className="rounded-full border border-hidaya-line bg-hidaya-tint px-3 py-1 text-xs font-semibold text-hidaya-ink">
                  {filteredCases.length} حالة
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-hidaya-muted">
              إدارة ومتابعة جميع الحالات المسجلة داخل الجمعية
            </p>
          </div>

          {/* Add Case */}

          <Button
            onClick={() => {
              setSelectedCase(null);
              setExpandedId(null);
              setOpen(true);
            }}
            className="cursor-pointer shadow-sm"
          >
            إضافة حالة
          </Button>
        </div>

        {/* ================= SEARCH & FILTER ================= */}

        <div className="mt-6 rounded-2xl border border-hidaya-line bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">

            {/* Search */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-hidaya-muted"
              />

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="ابحث بالاسم أو الهاتف أو الرقم القومي..."
                className="w-full rounded-xl border border-hidaya-line bg-white py-3 pl-4 pr-11 text-sm outline-none transition focus:border-hidaya-ink focus:ring-2 focus:ring-hidaya-tint"
              />
            </div>

            {/* Filter */}

            <div className="relative">
              <Filter
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-hidaya-muted"
              />

              <select
                value={sortStatus}
                onChange={(e) =>
                  setSortStatus(e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-hidaya-line bg-white py-3 pl-10 pr-10 text-sm outline-none transition focus:border-hidaya-ink focus:ring-2 focus:ring-hidaya-tint md:w-56"
              >
                <option value="">
                  فرز حسب الحالة
                </option>

                <option value="all">
                  كل الحالات
                </option>

                <option value="pending">
                  قيد المراجعة
                </option>

                <option value="in_progress">
                  جاري التنفيذ
                </option>

                <option value="completed">
                  مكتملة
                </option>

                <option value="rejected">
                  مرفوضة
                </option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-hidaya-muted"
              />
            </div>

            {/* Reset */}

            {(search || sortStatus) && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setSortStatus("");
                }}
              >
                إعادة تعيين
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-hidaya-tint"
            />
          ))}
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {!loading && filteredCases.length === 0 && (
        <div className="mt-6 rounded-2xl border border-hidaya-line bg-white p-10 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-hidaya-tint">
            <Search
              size={22}
              className="text-hidaya-muted"
            />
          </div>

          <p className="text-base font-medium text-hidaya-ink">
            {search || sortStatus
              ? "ما فيش حالات تطابق البحث"
              : "لا توجد حالات حتى الآن"}
          </p>

          <p className="mt-2 text-sm text-hidaya-muted">
            {search || sortStatus
              ? "جرب تغيير كلمات البحث أو الفلترة"
              : "ابدأ بإضافة أول حالة للجمعية"}
          </p>

          {(search || sortStatus) && (
            <div className="mt-5">
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setSortStatus("");
                }}
              >
                تصفير الفلتر
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ================= TABLE ================= */}

      {!loading && filteredCases.length > 0 && (
        <div className="mt-6 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-hidaya-line bg-white shadow-sm">

          <div className="w-full min-w-0 max-w-full">
            <table className="w-full text-right text-sm">

              {/* ================= HEAD ================= */}

              <thead className="border-b border-hidaya-line bg-hidaya-tint text-hidaya-muted">
                <tr>

                  <th className="w-10 px-2 py-4 font-semibold sm:w-auto sm:px-5">
                    م
                  </th>

                  <th className="px-3 py-4 font-semibold sm:px-5">
                    الاسم
                  </th>

                  <th className="hidden px-3 py-4 font-semibold sm:px-5 md:table-cell">
                    الرقم القومي
                  </th>

                  <th className="px-2 py-4 font-semibold sm:px-5">
                    الحالة
                  </th>

                  <th className="hidden px-3 py-4 font-semibold sm:px-5 sm:table-cell">
                    التصنيف
                  </th>

                  <th className="hidden px-3 py-4 font-semibold sm:px-5 lg:table-cell">
                    نوع المساعدة
                  </th>

                  <th className="hidden px-3 py-4 font-semibold sm:px-5 md:table-cell">
                    الهاتف
                  </th>

                  <th className="w-10 px-2 py-4 sm:w-14 sm:px-4">
                    <span className="sr-only">
                      تفاصيل
                    </span>
                  </th>

                </tr>
              </thead>

              {/* ================= BODY ================= */}

              <tbody>
                {filteredCases.map((item, index) => {
                  const expanded =
                    expandedId === item.id;

                  return (
                    <Fragment key={item.id}>

                      {/* ================= MAIN ROW ================= */}

                      <tr
                        className={`cursor-pointer border-b border-hidaya-tint transition-all duration-200 ${
                          expanded
                            ? "bg-hidaya-tint"
                            : "hover:bg-hidaya-body"
                        }`}
                        onClick={() => toggleRow(item)}
                        aria-expanded={expanded}
                      >

                        {/* Number */}

                        <td className="w-10 px-2 py-4 text-hidaya-muted sm:w-auto sm:px-5">
                          {index + 1}
                        </td>

                        {/* Name */}

                        <td className="min-w-0 px-3 py-4 font-semibold text-hidaya-ink sm:px-5">
                          <span className="block truncate">
                            {item.userName}
                          </span>
                        </td>

                        {/* National ID */}

                        <td className="hidden px-3 py-4 whitespace-nowrap sm:px-5 md:table-cell">
                          {item.nationalId}
                        </td>

                        {/* Status */}

                        <td className="px-2 py-4 sm:px-5">
                          <StatusBadge
                            status={item.status}
                          />
                        </td>

                        {/* Category */}

                        <td className="hidden px-3 py-4 sm:px-5 sm:table-cell">
                          {item.caseType}
                        </td>

                        {/* Support */}

                        <td className="hidden px-3 py-4 sm:px-5 lg:table-cell">
                          {item.supportType}
                        </td>

                        {/* Phone */}

                        <td
                          dir="ltr"
                          className="hidden px-3 py-4 text-right sm:px-5 md:table-cell"
                        >
                          {item.phone}
                        </td>

                        {/* Arrow */}

                        <td className="w-10 px-2 py-4 sm:w-14 sm:px-4">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                              expanded
                                ? "bg-white shadow-sm"
                                : "hover:bg-hidaya-tint"
                            }`}
                          >
                            <ChevronDown
                              className={`h-5 w-5 text-hidaya-muted transition-transform duration-300 ${
                                expanded
                                  ? "rotate-180"
                                  : ""
                              }`}
                              aria-hidden="true"
                            />
                          </div>
                        </td>

                      </tr>

                      {/* ================= EXPANDED DETAILS ================= */}

                      {expanded && (
                        <tr className="bg-hidaya-tint/60">

                          <td
                            colSpan={isMobile ? 4 : 8}
                            className="p-3 sm:p-5"
                          >
                            <div className="w-full min-w-0">
                              <CaseDrawer
                                selectedCase={
                                  item.status === selected?.status
                                    ? selected
                                    : item
                                }
                                onClose={() =>
                                  setExpandedId(null)
                                }
                                onEdit={() => {
                                  setSelectedCase(item);
                                  setExpandedId(null);
                                  setOpen(true);
                                }}
                                onArchive={() => {
                                  setSelectedCase(item);
                                  setConfirmOpen(true);
                                }}
                                onStatusChange={
                                  handleStatusChange
                                }
                              />
                            </div>
                          </td>

                        </tr>
                      )}

                    </Fragment>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* ================= CASE MODAL ================= */}

      <CaseModal
        open={open}
        setOpen={setOpen}
        selectedCase={selectedCase}
        getCases={getCases}
        setSelectedCase={setSelectedCase}
      />

      {/* ================= CONFIRM DIALOG ================= */}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleArchive}
        title="نقل للأرشيف"
        body="هتنقل الحالة للأرشيف. تقدر تسترجعها بعدين."
        confirmLabel="نقل"
        danger
      />
    </div>
  );
}
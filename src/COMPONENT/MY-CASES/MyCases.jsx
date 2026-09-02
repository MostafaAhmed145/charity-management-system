import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { AuthContext } from "../CONTEXT/Context";
import { Button } from "../UI/Button.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import { StatusBadge } from "../UI/StatusBadge.jsx";
import { PATHS } from "../../lib/paths.js";
import { maskNationalId, statusReassurance } from "../../lib/status.js";
import { MSG } from "../../lib/validation.js";

export default function MyCases() {
  const { user } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "متابعة الطلب — جمعية الهداية";
  }, []);

  useEffect(() => {
    const getMyCases = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "cases"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        setCases(
          snapshot.docs
            .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
            .filter((item) => item.archived !== true)
        );
      } catch {
        toast.error(MSG.network);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    getMyCases();
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        type="button"
        className="mb-4 text-sm text-[#1F5C45]"
        onClick={() => navigate(PATHS.userHome)}
      >
        رجوع
      </button>
      <PageHeading className="mb-6">طلباتك</PageHeading>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-[14px] bg-[#E6EEE9]" />
          ))}
        </div>
      )}

      {!loading && cases.length === 0 && (
        <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-8 text-center">
          <p className="mb-4 text-center text-sm font-medium text-[#3F5349] drop-shadow-[0_0_8px_rgba(8,148,94,0.18)]">
            لا توجد لديك طلبات حتى الآن 
          </p>

          <Button onClick={() => navigate(PATHS.submitCase)}>تقديم طلب</Button>
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {cases.map((item) => (
            <article key={item.id} className="rounded-[14px] border border-[#D5DFD9] bg-white p-5">
              <StatusBadge status={item.status} />
              <h2 className="mt-3 text-lg font-semibold text-[#1C211E]">
                {item.supportType} — {item.userName}
              </h2>
              <p className="mt-1 text-sm text-[#3F5349]">
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleDateString("ar-EG")
                  : ""}
              </p>
              <p className="mt-1 text-sm text-[#3F5349]" dir="ltr">
                {maskNationalId(item.nationalId)}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#3F5349]">
                {statusReassurance(item.status)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

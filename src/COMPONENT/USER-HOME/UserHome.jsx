import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../CONTEXT/Context";
import { Button } from "../UI/Button.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";

export default function UserHome() {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const first = (userData?.name || "").trim().split(/\s+/)[0];

  useEffect(() => {
    document.title = "جمعية الهداية";
  }, []);

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <p className="text-sm text-[#3F5349]">
        {first ? `السلام عليكم يا ${first}` : "السلام عليكم"}
      </p>
      <PageHeading className="mt-2 mb-8">إزاي نقدر نساعدك؟</PageHeading>

      <div className="space-y-3">
        <Link
          to="/submitCase"
          className="block rounded-[14px] border border-[#D5DFD9] bg-white p-4"
        >
          <strong className="block text-[#1C211E]">تقديم طلب</strong>
          <span className="text-sm text-[#3F5349]">اكتب بيانات الحالة في خطوات قصيرة</span>
        </Link>
        <Link
          to="/myCases"
          className="block rounded-[14px] border border-[#D5DFD9] bg-white p-4"
        >
          <strong className="block text-[#1C211E]">متابعة طلباتك</strong>
          <span className="text-sm text-[#3F5349]">شوف حالة الطلب من غير لف</span>
        </Link>
        <a
          href="https://wa.me/201121122552"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-[14px] border border-[#D5DFD9] bg-white p-4"
        >
          <strong className="block text-[#1C211E]">تواصل واتساب</strong>
          <span className="text-sm text-[#3F5349]">تواصل معنا على واتساب</span>
        </a>
      </div>

      <Button className="mt-8 w-full" onClick={() => navigate("/submitCase")}>
        تقديم طلب مساعدة
      </Button>
    </section>
  );
}

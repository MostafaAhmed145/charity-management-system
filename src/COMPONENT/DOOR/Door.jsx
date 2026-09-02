import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../CONTEXT/Context";
import { Button } from "../UI/Button.jsx";
import { LogoLockup } from "../UI/LogoLockup.jsx";
import { PATHS } from "../../lib/paths.js";

const STEPS = [
  { n: "١", text: "تقدّم الطلب" },
  { n: "٢", text: "نراجعه معاك" },
  { n: "٣", text: "نبلغك بالحالة" },
];

export default function Door() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "جمعية الهداية";
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col px-4 py-10 pt-20">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <LogoLockup size={56} showWord variant="hero" />

        <p className="mt-6 max-w-xs text-base leading-7 text-[#3F5349]">
          أهل بيتك… لو محتاج مساعدة، إحنا هنا.
        </p>

        <div className="mt-9 flex w-full flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => navigate(user ? PATHS.submitCase : PATHS.register)}
          >
            تقديم طلب مساعدة
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate(user ? PATHS.myCases : PATHS.login)}
          >
            متابعة طلب
          </Button>
        </div>

        <div className="mt-12 w-full rounded-2xl border border-[#3F5349]/10 bg-[#3F5349]/[0.04] px-5 py-5">
          <ol className="space-y-3.5 text-right">
            {STEPS.map((step, i) => (
              <li key={step.n} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1F5C45]/10 text-sm font-medium text-[#1F5C45]">
                  {step.n}
                </span>
                <span className="text-sm text-[#3F5349]">{step.text}</span>
                {i < STEPS.length - 1 && (
                  <span className="sr-only">التالي</span>
                )}
              </li>
            ))}
          </ol>
        </div>

       <div className="flex items-center justify-center gap-2 text-sm my-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 font-medium text-[#1F5C45] transition hover:bg-[#1F5C45]/10"
          >
            تسجيل الدخول
          </Link>

          <span className="h-5 w-px bg-gray-200" />

          <Link
            to="/register"
            className="rounded-lg bg-[#1F5C45] px-4 py-2 font-medium text-white shadow-sm transition hover:bg-[#174634] hover:shadow"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>

      <p className="border-t border-[#3F5349]/10 pt-4 pb-2 text-center text-sm text-[#3F5349]">
        جمعية الهداية
      </p>
    </div>
  );
}
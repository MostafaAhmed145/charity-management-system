import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../CONTEXT/Context";
import { Button } from "../UI/Button.jsx";
import { LogoLockup } from "../UI/LogoLockup.jsx";
import { PATHS } from "../../lib/paths.js";

export default function Door() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "جمعية الهداية";
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col justify-between px-4 py-10">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <LogoLockup size={56} showWord variant="hero" />
        <p className="mt-6 text-base leading-7 text-[#3F5349]">
          أهل بيتك… لو محتاج مساعدة، إحنا هنا.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
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

        <ol className="mt-10 w-full space-y-2 text-right text-sm text-[#3F5349]">
          <li>١ — تقدّم الطلب</li>
          <li>٢ — نراجعه معاك</li>
          <li>٣ — نبلغك بالحالة</li>
        </ol>

        <p className="mt-8 text-sm text-[#3F5349]">
          <Link to="/login" className="text-[#1F5C45] underline-offset-4 hover:underline">
            تسجيل الدخول
          </Link>
          {" · "}
          <Link to="/register" className="text-[#1F5C45] underline-offset-4 hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>

      <p className="pb-2 text-center text-sm text-[#3F5349]">جمعية الهداية</p>
    </div>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../UI/Button.jsx";
import { LogoLockup } from "../UI/LogoLockup.jsx";

export default function NotFound() {
  useEffect(() => {
    document.title = "الصفحة غير موجودة — جمعية الهداية";
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 text-center">
      <LogoLockup size={48} showWord />
      <p className="mt-8 font-ruqaa text-6xl text-[#1F5C45]">404</p>
      <h1 className="mt-4 font-ruqaa text-2xl text-[#1C211E]">الصفحة غير موجودة</h1>
      <p className="mt-2 text-sm text-[#3F5349]">
        الصفحة دي مش موجودة أو اتنقلت.
      </p>
      <Link to="/" className="mt-6">
        <Button>العودة للرئيسية</Button>
      </Link>
    </div>
  );
}

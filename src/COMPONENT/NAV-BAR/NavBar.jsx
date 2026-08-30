import { getAuth, signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import app from "../../firebase";
import { toast } from "react-toastify";
import { AuthContext } from "../CONTEXT/Context";
import { LogoLockup } from "../UI/LogoLockup.jsx";
import { Menu, X } from "lucide-react";

function getFirstName(name) {
  if (!name || typeof name !== "string") return "";
  return name.trim().split(/\s+/)[0] ?? "";
}

function getAvatarLetter(name) {
  const first = getFirstName(name);
  if (!first) return "";
  return first.charAt(0);
}

export default function NavBar() {
  const { user, userData, role } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [narrow, setNarrow] = useState(false);

  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 380px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  async function Logout() {
    try {
      await signOut(auth);
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/login", { replace: true });
    } catch {
      toast.error("حدث خطا ما");
    }
  }

  const isAdmin = role === "admin" || role === "superAdmin";
  const firstName = getFirstName(userData?.name);
  const avatarLetter = getAvatarLetter(userData?.name);

  return (
    <nav className="fixed top-0 right-0 left-0 z-[30] h-16 bg-[#143D2E] shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="shrink-0">
          <LogoLockup
            size={36}
            showWord
            word={narrow ? "الهداية" : "جمعية الهداية"}
            onDark
          />
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {!user ? (
            <>
              <Link
                to="/register"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#F4F4F2]/80 transition hover:text-[#F4F4F2]"
              >
                إنشاء حساب
              </Link>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#F4F4F2]/80 transition hover:text-[#F4F4F2]"
              >
                تسجيل الدخول
              </Link>
            </>
          ) : (
            <>
              {isAdmin && (
                <Link
                  to="/dashBoard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-[#F4F4F2]/90 transition hover:text-[#F4F4F2]"
                >
                  لوحة التحكم
                </Link>
              )}

              {firstName && (
                <span className="text-sm font-medium text-[#F4F4F2]">{firstName}</span>
              )}

              {isAdmin && (
                <Link
                  to="/userHome"
                  className="text-xs text-[#F4F4F2]/70 transition hover:text-[#F4F4F2]"
                >
                  واجهة المستخدم
                </Link>
              )}

              <button
                type="button"
                onClick={() => navigate("/Profile")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F5C45] text-sm font-bold text-[#F4F4F2]"
                aria-label="الملف الشخصي"
              >
                {avatarLetter}
              </button>

              <button
                type="button"
                onClick={Logout}
                className="text-sm font-medium text-[#F4F4F2]/90 transition hover:text-[#F4F4F2]"
              >
                تسجيل الخروج
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-[#F4F4F2] md:hidden"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#1F5C45] bg-[#143D2E] px-4 pb-4 md:hidden">
          {!user ? (
            <div className="space-y-2 pt-2">
              <Link
                to="/register"
                className="block rounded-md px-3 py-2 text-[#F4F4F2]/90 hover:bg-[#1F5C45]"
                onClick={() => setOpen(false)}
              >
                إنشاء حساب
              </Link>
              <Link
                to="/login"
                className="block rounded-md px-3 py-2 text-[#F4F4F2]/90 hover:bg-[#1F5C45]"
                onClick={() => setOpen(false)}
              >
                تسجيل الدخول
              </Link>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              {firstName && (
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F5C45] text-sm font-bold text-[#F4F4F2]">
                    {avatarLetter}
                  </span>
                  <span className="text-sm font-medium text-[#F4F4F2]">{firstName}</span>
                </div>
              )}

              {isAdmin && (
                <Link
                  to="/dashBoard"
                  className="block rounded-md px-3 py-2 text-[#F4F4F2] hover:bg-[#1F5C45]"
                  onClick={() => setOpen(false)}
                >
                  لوحة التحكم
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/userHome"
                  className="block rounded-md px-3 py-2 text-xs text-[#F4F4F2]/70 hover:bg-[#1F5C45]"
                  onClick={() => setOpen(false)}
                >
                  واجهة المستخدم
                </Link>
              )}

              <Link
                to="/Profile"
                className="block rounded-md px-3 py-2 text-[#F4F4F2] hover:bg-[#1F5C45]"
                onClick={() => setOpen(false)}
              >
                الملف الشخصي
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  Logout();
                }}
                className="block w-full rounded-md px-3 py-2 text-right text-sm font-medium text-[#F4F4F2] hover:bg-[#1F5C45]"
              >
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

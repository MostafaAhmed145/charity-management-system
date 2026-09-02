import { getAuth, signOut } from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircleUser, Menu, X } from "lucide-react";

import app from "../../firebase";
import { AuthContext } from "../CONTEXT/Context";
import { useDashboardNav } from "../DASH-BOARD/dashboardNavContext.jsx";
import { LogoLockup } from "../UI/LogoLockup.jsx";
import { PATHS } from "../../lib/paths.js";


function getFirstName(name) {
  if (!name || typeof name !== "string") return "";

  return name.trim().split(/\s+/)[0] ?? "";
}


function getAvatarLetter(name) {
  const first = getFirstName(name);

  if (!first) return "";

  return first.charAt(0);
}


function useDismissible(open, setOpen) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, setOpen]);

  return rootRef;
}


const menuItemClass =
  "flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-hidaya-accent hover:bg-hidaya-tint";


function GuestAccountMenu() {
  const [open, setOpen] = useState(false);

  const rootRef = useDismissible(open, setOpen);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center text-hidaya-body"
        aria-label="الحساب"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {open ? (
          <X className="h-7 w-7" />
        ) : (
          <CircleUser className="h-7 w-7" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-40 mt-2 w-48 rounded-xl border border-hidaya-line bg-white p-2 shadow-lg"
        >
          <Link
            to={PATHS.register}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            إنشاء حساب
          </Link>

          <Link
            to={PATHS.login}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            تسجيل الدخول
          </Link>
        </div>
      )}
    </div>
  );
}


function AccountMenu({ avatarLetter, onLogout }) {
  const [open, setOpen] = useState(false);

  const rootRef = useDismissible(open, setOpen);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-hidaya-accent text-sm font-bold text-hidaya-body"
        aria-label="الحساب"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {avatarLetter}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-40 mt-2 w-48 rounded-xl border border-hidaya-line bg-white p-2 shadow-lg"
        >
          <Link
            to={PATHS.profile}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            الملف الشخصي
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className={`${menuItemClass} w-full`}
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}


export default function NavBar() {
  const { user, userData, role } = useContext(AuthContext);

  const {
    open: sidebarOpen,
    toggle: toggleSidebar,
    enabled: sidebarEnabled,
  } = useDashboardNav();

  const [open, setOpen] = useState(false);
  const [narrow, setNarrow] = useState(false);

  const auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();

  const onDashboard = location.pathname.startsWith(PATHS.dashboard);

  const isAdmin =
    role === "admin" ||
    role === "superAdmin";

  const firstName = getFirstName(userData?.name);
  const avatarLetter = getAvatarLetter(userData?.name);

  const showDashboardLink =
    isAdmin && !onDashboard;

  const showSidebarToggle =
    Boolean(
      user &&
      isAdmin &&
      onDashboard &&
      sidebarEnabled
    );


  useEffect(() => {
    const mq = window.matchMedia("(max-width: 380px)");

    const update = () => {
      setNarrow(mq.matches);
    };

    update();

    mq.addEventListener("change", update);

    return () => {
      mq.removeEventListener("change", update);
    };
  }, []);


  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);


  async function Logout() {
    try {
      await signOut(auth);

      toast.success("تم تسجيل الخروج بنجاح");

      navigate(PATHS.login, {
        replace: true,
      });
    } catch {
      toast.error("تعذر تسجيل الخروج، حاول مرة تانية");
    }
  }


  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-16 bg-hidaya-accent-dark shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Logo + Sidebar Button */}
        <div className="flex min-w-0 items-center gap-2">

          {showSidebarToggle ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-hidaya-body transition-colors duration-200 hover:bg-hidaya-accent lg:hidden"
              aria-label={
                sidebarOpen
                  ? "إغلاق قائمة لوحة التحكم"
                  : "فتح قائمة لوحة التحكم"
              }
              aria-expanded={sidebarOpen}
              aria-controls="dashboard-sidebar"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          ) : null}


          <Link
            to={
              user
                ? isAdmin
                  ? PATHS.dashboard
                  : PATHS.userHome
                : "/"
            }
            className="shrink-0"
          >
            <LogoLockup
              size={40}
              showWord
              word={narrow ? "الهداية" : "جمعية الهداية"}
              onDark
            />
          </Link>

        </div>


        {/* Guest */}
        {!user ? (
          <GuestAccountMenu />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden items-center gap-4 md:flex">

              {isAdmin ? (
                showDashboardLink && (
                  <Link
                    to={PATHS.dashboard}
                    className="rounded-md px-3 py-2 text-sm font-medium text-hidaya-body/90 transition hover:text-hidaya-body"
                  >
                    لوحة التحكم
                  </Link>
                )
              ) : (
                <Link
                  to={PATHS.userHome}
                  className="rounded-md px-3 py-2 text-sm font-medium text-hidaya-body/90 transition hover:text-hidaya-body"
                >
                  الرئيسية
                </Link>
              )}


              {firstName && (
                <span className="text-sm font-medium italic text-hidaya-body">
                  {firstName}
                </span>
              )}


              <AccountMenu
                avatarLetter={avatarLetter}
                onLogout={Logout}
              />


              <button
                type="button"
                onClick={Logout}
                className="text-sm font-medium text-hidaya-body/90 transition hover:text-hidaya-body"
              >
                تسجيل الخروج
              </button>

            </div>


            {/* Mobile Account Button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-hidaya-body md:hidden"
              aria-label={
                open
                  ? "إغلاق قائمة الحساب"
                  : "فتح قائمة الحساب"
              }
              aria-expanded={open}
            >
              {open ? (
                <X className="h-7 w-7" />
              ) : (
                <CircleUser className="h-7 w-7" />
              )}
            </button>

          </>
        )}
      </div>


      {/* Mobile Menu */}
      {user && open && (
        <div className="border-t border-hidaya-accent bg-hidaya-accent-dark px-4 pb-4">
          <div className="space-y-2 pt-2">

            {/* User Name */}
            {firstName && (
              <div className="flex items-center gap-3 px-3 py-2">

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-hidaya-accent text-sm font-bold text-hidaya-body">
                  {avatarLetter}
                </span>

                <span className="text-sm font-medium text-hidaya-body">
                  {firstName}
                </span>

              </div>
            )}


            {/* Main Navigation */}
            {isAdmin ? (
              showDashboardLink && (
                <Link
                  to={PATHS.dashboard}
                  className="block rounded-md px-3 py-2 text-hidaya-body hover:bg-hidaya-accent"
                  onClick={() => setOpen(false)}
                >
                  لوحة التحكم
                </Link>
              )
            ) : (
              <Link
                to={PATHS.userHome}
                className="block rounded-md px-3 py-2 text-hidaya-body hover:bg-hidaya-accent"
                onClick={() => setOpen(false)}
              >
                الرئيسية
              </Link>
            )}


            {/* Profile */}
            <Link
              to={PATHS.profile}
              className="block rounded-md px-3 py-2 text-hidaya-body hover:bg-hidaya-accent"
              onClick={() => setOpen(false)}
            >
              الملف الشخصي
            </Link>


            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                Logout();
              }}
              className="block w-full rounded-md px-3 py-2 text-right text-sm font-medium text-hidaya-body hover:bg-hidaya-accent"
            >
              تسجيل الخروج
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}
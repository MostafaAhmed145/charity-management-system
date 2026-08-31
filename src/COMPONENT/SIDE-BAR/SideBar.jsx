import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FileUser, ShieldCheck, Trash2 } from "lucide-react";
import { AuthContext } from "../CONTEXT/Context";
import { useDashboardNav } from "../DASH-BOARD/dashboardNavContext.jsx";
import { PATHS } from "../../lib/paths.js";
import { isSidebarLinkActive } from "../../lib/sidebarNav.js";

export default function SideBar() {
  const { role } = useContext(AuthContext);
  const { open, setOpen } = useDashboardNav();
  const { pathname } = useLocation();

  const links = [
    { name: "الحالات", path: PATHS.dashboard, icon: FileUser, match: [PATHS.dashboard, PATHS.dashboardCases] },
    { name: "الأرشيف", path: PATHS.dashboardTrash, icon: Trash2, match: [PATHS.dashboardTrash] },
  ];
  if (role === "superAdmin") {
    links.push({ name: "المسؤولون", path: PATHS.superAdmin, icon: ShieldCheck, match: [PATHS.superAdmin] });
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 top-16 z-35 bg-hidaya-ink/40 md:hidden"
          aria-label="إغلاق القائمة"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        id="dashboard-sidebar"
        aria-label="قائمة لوحة التحكم"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={`fixed top-16 right-0 z-40 flex h-[calc(100vh-4rem)] w-(--hidaya-sidebar) flex-col border-l border-hidaya-accent bg-hidaya-accent-dark text-hidaya-body transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <p className="border-b border-hidaya-accent px-5 py-4 text-sm font-medium text-hidaya-body/80">
          غرفة الإدارة
        </p>
        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (window.matchMedia("(max-width: 767px)").matches) {
                    setOpen(false);
                  }
                }}
                className={() => {
                  const isActive = isSidebarLinkActive(pathname, link.match);
                  return `flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-hidaya-accent text-hidaya-body"
                      : "text-hidaya-body/85 hover:bg-hidaya-accent/50 hover:text-hidaya-body"
                  }`;
                }}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

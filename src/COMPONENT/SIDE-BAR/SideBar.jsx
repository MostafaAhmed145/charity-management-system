import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FileUser, Menu, ShieldCheck, Trash2, X } from "lucide-react";
import { AuthContext } from "../CONTEXT/Context";
import { LogoLockup } from "../UI/LogoLockup.jsx";

export default function SideBar() {
  const { role } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const links = [
    { name: "الحالات", path: "cases", icon: <FileUser size={20} /> },
    { name: "الأرشيف", path: "trash", icon: <Trash2 size={20} /> },
  ];
  if (role === "superAdmin") {
    links.push({ name: "المسؤولون", path: "SuperAdmin", icon: <ShieldCheck size={20} /> });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-20 right-4 z-[50] rounded-[12px] border border-[#D5DFD9] bg-white p-2 md:hidden"
      >
        <Menu />
      </button>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[50] bg-black/40 md:hidden"
          aria-label="إغلاق القائمة"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 right-0 z-[40] h-[calc(100vh-4rem)] w-[var(--hidaya-sidebar)] bg-[#1C211E] text-[#E6EEE9] transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <LogoLockup size={28} showWord word="الهداية" onDark />
          <button type="button" className="md:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[12px] px-4 py-3 ${
                  isActive ? "bg-[#1F5C45] text-white" : "hover:bg-white/10"
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

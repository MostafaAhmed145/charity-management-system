import { House, Menu, FileUser, Trash2, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function SideBar() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      name: "الحالات",
      path: "cases",
      icon: <FileUser size={20} />,
    },
    {
      name: " الارشيف",
      path: "trash",
      icon: <Trash2 size={20} />,
    },
    {
      name: "إدارة المسؤولين",
      path: "SuperAdmin",
      icon: <ShieldCheck size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-20 right-4 z-50 bg-white shadow rounded-lg p-2"
      >
        <Menu />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        dir="rtl"
        className={`
          fixed top-16 right-0  h-[calc(100vh-64px)] w-64
          bg-gray-900 text-white
          transform transition-transform duration-300
          z-50
          
          ${open ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-2xl"
          >
            ✕
          </button>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <House size={22} />
            لوحة التحكم
          </h2>
        </div>

        <nav className="flex flex-col p-4 gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-800"
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
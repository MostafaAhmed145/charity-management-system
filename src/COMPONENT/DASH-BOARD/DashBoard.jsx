import { Outlet } from "react-router-dom";
import SideBar from "../SIDE-BAR/SideBar";
import { useDashboardNav } from "./dashboardNavContext.jsx";

export default function DashBoard() {
  const { open } = useDashboardNav();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <SideBar />
      <main
        className={`p-4 transition-[margin] duration-200 ease-out md:p-6 ${
          open ? "md:mr-(--hidaya-sidebar)" : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

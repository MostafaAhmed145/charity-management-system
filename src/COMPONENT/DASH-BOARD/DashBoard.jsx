import { Outlet } from "react-router-dom";
import SideBar from "../SIDE-BAR/SideBar";
import { useDashboardNav } from "./dashboardNavContext.jsx";

export default function DashBoard() {
  const { open } = useDashboardNav();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <SideBar />

      <main
        className={`min-h-[calc(100vh-4rem)] min-w-0 p-4 transition-all duration-200 ease-out md:p-6 py-20 lg:mr-(--hidaya-sidebar)`}
      >
      <Outlet />
    </main>
    </div>
  );
}
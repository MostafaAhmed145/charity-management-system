import { Outlet } from "react-router-dom";
import { DashboardNavProvider } from "../DASH-BOARD/dashboardNavContext.jsx";
import NavBar from "../NAV-BAR/NavBar";

export default function LayOute() {
  return (
    <DashboardNavProvider>
      <NavBar />
      <div className="pt-16">
        <Outlet />
      </div>
    </DashboardNavProvider>
  );
}

import { Outlet } from "react-router-dom";
import { DashboardNavProvider } from "../DASH-BOARD/dashboardNavContext.jsx";
import NavBar from "../NAV-BAR/NavBar";
import SideBar from "../SIDE-BAR/SideBar";

export default function LayOute() {
  return (
    <DashboardNavProvider>
      <NavBar />

    <Outlet />
    </DashboardNavProvider>
  );
}
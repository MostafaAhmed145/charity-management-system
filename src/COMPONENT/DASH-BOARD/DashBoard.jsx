import { Outlet } from "react-router-dom";
import SideBar from "../SIDE-BAR/SideBar";

export default function DashBoard() {
  return (
    <>
      <SideBar />
      <main className="p-4 md:p-6 md:mr-[var(--hidaya-sidebar)]">
        <Outlet />
      </main>
    </>
  );
}

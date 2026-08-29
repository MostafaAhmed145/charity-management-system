import React from "react";
import SideBar from "../SIDE-BAR/SideBar";
import { Outlet } from "react-router-dom";

export default function DashBoard() {
  return (
    <>
      <SideBar />

      <main className="p-4 md:p-6 md:mr-64 mt-16">
        <Outlet />
      </main>
    </>
  );
}
import React from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "./MainNavbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-[Inter,sans-serif]">
      <MainNavbar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

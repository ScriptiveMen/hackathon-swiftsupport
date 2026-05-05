import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import HomeFooter from "../home/HomeFooter";

const MainLayout = () => {
  const location = useLocation();
  const isDocsPage = location.pathname === "/docs";

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-[Inter,sans-serif]">
      <MainNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isDocsPage && <HomeFooter />}
    </div>
  );
};

export default MainLayout;

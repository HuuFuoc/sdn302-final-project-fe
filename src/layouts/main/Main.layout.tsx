import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import HeaderLayout from "./Header.layout";
import FooterLayout from "./Footer.layout";
import { ROUTER_URL } from "../../consts/router.path.const";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === ROUTER_URL.COMMON.HOME || pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout />
      <main
        className={
          isHomePage
            ? "flex-grow w-full"
            : "flex-grow container mx-auto px-0"
        }
      >
        <Outlet />
      </main>
      {!isHomePage && <FooterLayout />}
    </div>
  );
};

export default MainLayout;

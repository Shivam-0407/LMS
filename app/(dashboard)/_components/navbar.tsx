import { NavBarRoutes } from "@/components/navbar-routes";
import { MobileSideBar } from "./mobile-sidebar";

export const NavBar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSideBar />
      <NavBarRoutes />
    </div>
  );
};

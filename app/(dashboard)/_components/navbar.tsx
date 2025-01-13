import { NavBarRoutes } from "@/components/navbar-routes";
import { MobileSideBar } from "./mobile-sidebar";
import { auth } from "@clerk/nextjs/server";

export const NavBar = async() => {
  const {userId} = await auth()
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSideBar />
      <NavBarRoutes />
    </div>
  );
};

import Logo from "./_components/logo";
import SideBar from "./_components/sidebar";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex fixed flex-col h-full w-56 inset-y-0 z-50">
        <SideBar />
      </div>
      
      {children}
    </div>
  );
};

export default DashBoardLayout;

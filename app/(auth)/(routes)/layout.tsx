import { useUser } from "@clerk/nextjs";
import SignInPage from "./sign-in/[[...sign-in]]/page";

type LayoutProps = {
  children: React.ReactNode;
};
export default function RoutesLayout({ children }: LayoutProps) {

  return (
    <div className="h-full p-10 flex justify-center items-center">
      {children}
    </div>
  );
}

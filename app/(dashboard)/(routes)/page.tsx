import { UserButton } from "@clerk/nextjs";

const UserDashboard = () => {
  return ( <UserButton afterSwitchSessionUrl="/"/> );
}

export default UserDashboard;
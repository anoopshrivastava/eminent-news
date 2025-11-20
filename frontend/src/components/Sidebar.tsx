import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Users, Building2, Wallet, ClipboardList } from "lucide-react";
import profileIcon from '../assets/profileIcon.svg'
// import { useAuthUser } from "@/hooks/useAuth";


interface SidebarItem {
  label: string;
  // icon: string;
  icon: React.ReactElement;
  key: string;
  path: string;
}

export const navLinks: SidebarItem[] = [
  {
    label: "Issue Tickets",
    // icon: dashboardIcon,
    icon: <Users />,
    key: "issue-tickets",
    path: "/",
  },
  {
    label: "Manage Profile",
    // icon: roomIcon,
    icon: <Building2 />,
    key: "my-profile",
    path: "/my-profile",
  },
  {
    label: "Reports",
    // icon: walletIcon,
    icon: <Wallet/>,
    key: "reports",
    path: "/reports",
  },
  {
    label: "Ticket History",
    // icon: checkinIcon,
    icon: <ClipboardList /> ,
    key: "ticket-history",
    path: "/ticket-history",
  },
];


const Sidebar: React.FC = () => {

  // const { data: user } = useAuthUser();

  return (
    <nav className="w-64 border-r border-gray-200 bg-white px-3 py-6 hidden md:block fixed left-0 top-20 min-h-[90vh] shadow-md rounded-md ">
        <div className="flex flex-col justify-center items-center pb-6">
            <img src={profileIcon} alt="Profile Icon" className="h-16" />
            {/* <p className="mt-2">{user?.name}</p>
            <p className="text-gray-500">{user?.provider.name}</p> */}
        </div>
      <ul className="flex flex-col space-y-2">
        {navLinks
          .map(({ label, icon, key, path }) => (
            <li key={key}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-xl px-3 py-3 font-medium transition-colors duration-150",
                    isActive
                      ? "bg-[#FF5B00] text-[#FFFFFF]"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                {/* <img src={icon} alt="Icon" className="h-5" /> */}
                {icon}
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Sidebar;

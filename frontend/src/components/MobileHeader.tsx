import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Clapperboard,
  Plus,
  UserRound,
  NewspaperIcon,
} from "lucide-react";

const MobileHeader = () => {
  const location = useLocation();
  
  const navItems = [
    { label: "Home", to: "/", icon: <Home className="h-6 w-6" /> },

    {
      label: "News",
      to: "/news",
      icon: <NewspaperIcon className="h-6 w-6" />,
    },
    
    {
      label: "",
      to: "#",
      icon: ( 
        <div className="h-11 w-12 bg-gray-200 rounded-full flex items-center justify-center shadow">
          <Plus className="h-7 w-7" />
        </div>
      ),
    },

    { label: "Shorts", to: "/shorts", icon: <Clapperboard className="h-6 w-6" /> },

    { label: "Profile", to: "/my-profile", icon: <UserRound className="h-6 w-6" /> },
  ];
  

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md pt-2 pb-2 flex justify-around md:hidden z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center"
          >
            <div
              className={`${
                isActive ? "text-red-500" : "text-black"
              } transition`}
            >
              {item.icon}
            </div>
            <span
              className={`text-[13px] font-medium ${
                isActive ? "text-red-500" : "text-black"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileHeader;

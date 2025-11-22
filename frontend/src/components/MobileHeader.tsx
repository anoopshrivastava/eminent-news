import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Newspaper,
  Globe,
  BarChart3,
} from "lucide-react";

const MobileHeader = () => {
  const location = useLocation();

  const navItems = [
    { label: "HOME", to: "/", icon: <Home className="h-6 w-6" /> },
    { label: "National", to: "/national", icon: <Newspaper className="h-6 w-6 text-red-500" /> },
    { label: "World News", to: "/world-news", icon: <Globe className="h-6 w-6 text-blue-500" /> },
    { label: "Trending News", to: "/trending", icon: <BarChart3 className="h-6 w-6 text-orange-500" /> },
    // {
    //   label: "What's App",
    //   to: "/whatsapp",
    //   icon:<Home className="h-6 w-6" />,
    // },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md py-2 flex justify-around md:hidden z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`${
                isActive ? "text-black" : "text-gray-500"
              } transition`}
            >
              {item.icon}
            </div>
            <span
              className={`text-[11px] font-medium ${
                isActive ? "text-black" : "text-gray-600"
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

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Clapperboard,
  // Plus,
  UserRound,
  Video,
  LayoutDashboard,
} from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "@/redux/authSlice";
import toast from "react-hot-toast";
import api from "@/lib/axios";

const MobileHeader = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/home", icon: <Home className="h-6 w-6" /> },

    {
      label: "Category",
      action: "OPEN_MENU",
      icon: <LayoutDashboard className="h-6 w-6" />,
    },

    {
      label: "Shorts",
      to: "/shorts",
      icon: <Clapperboard className="h-6 w-6" />,
    },
    { label: "Videos", to: "/videos", icon: <Video className="h-6 w-6" /> },
    {
      label: "Profile",
      to: "/profile",
      icon: <UserRound className="h-6 w-6" />,
    },
  ];

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const response = await api.post("/logout");
      if (response.data.success === false) {
        dispatch(signOutFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }
      console.log("Logout Success:", response.data);
      toast.success("Logout Successful");
      dispatch(signOutSuccess());
      navigate("/login");
    } catch (error: any) {
      console.log(error);
      dispatch(signOutFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md pt-2 pb-2 flex justify-around md:hidden z-50">
      {navItems.map((item) => {
        const isActive = item.to && location.pathname === item.to;

        // CATEGORY → OPEN MOBILE MENU
        if (item.action === "OPEN_MENU") {
          return (
            <button
              key={item.label}
              onClick={() => setMenuOpen(true)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="text-black transition">{item.icon}</div>
              <span className="text-[13px] font-medium text-black">
                {item.label}
              </span>
            </button>
          );
        }

        // NORMAL NAV LINKS
        return (
          <Link
            key={item.to}
            to={item.to as string}
            className="flex flex-col items-center"
          >
            <div
              className={`${
                isActive ? "text-[#f40607]" : "text-black"
              } transition`}
            >
              {item.icon}
            </div>
            <span
              className={`text-[13px] font-medium ${
                isActive ? "text-[#f40607]" : "text-black"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default MobileHeader;

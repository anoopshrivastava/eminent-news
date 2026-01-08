import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-white.png";
import { Input } from "./ui/input";
import { Search, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "@/redux/authSlice";
import toast from "react-hot-toast";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import profile from "../assets/profile.webp";

const Header = () => {
  const { currentUser } = useSelector((state: any) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const response = await api.get("/logout");
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

  const [googleBarVisible, setGoogleBarVisible] = useState(false);
  console.log(googleBarVisible)

  useEffect(() => {
    const interval = setInterval(() => {
      setGoogleBarVisible(
        Boolean((window as any).__googleTranslateVisible)
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full fixed z-50 transition-all duration-200" style={{ top: googleBarVisible ? "40px" : "0px" }}>

      {/* Second row: small bar with hamburger + search icons on left (and optional search input) */}
      <div className="flex justify-between items-center w-full bg-[#f40607] px-2 md:px-14 py-2 shadow-sm">
        <div className="flex items-center">
          {/* left group */}
          <div className="flex items-center gap-2 md:gap-6">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="rounded transition"
            >
              <Menu size={32} className="hidden md:block text-white hover:text-black" />
              <Menu size={26} className="block md:hidden text-white hover:text-black" />
            </button>

            <div className="flex items-center gap-2">
              <Link to="/home">
                <img src={logo} alt="" className="h-7 md:h-9" />
              </Link>

              <div className="flex flex-col text-white -ml-1 md:ml-0 border-l-2 border-white pl-2 md:pl-3">
                <h3 className="text-[16px] md:text-3xl font-bold">The Eminent News</h3>
                <h5 className="text-[10px] md:text-xs -mt-1 pl-1">Empowering Wisdom</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0 md:gap-3">
          <div className="hidden md:block relative w-64">
            <Input
              type="text"
              placeholder="Search news..."
              className="rounded-lg pl-3 pr-10 py-1.5 w-full bg-white border-none text-red-600"
            />
            <Search className="text-black absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 " />
          </div>
          <div className="">
            <Search className="flex items-center md:hidden text-white mr-3" />
          </div>
          {currentUser ? (
            <div
              onClick={() => navigate("/my-profile")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src={currentUser?.avatar || profile} alt="" className="h-10 w-10 rounded-full" />
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-black px-3 pt-1 pb-1.5 hover:bg-black hover:text-white rounded-md flex items-center font-medium"
            >
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default Header;

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
import { useState } from "react";
import api from "@/lib/axios";
import MobileTopHeader from "./MobileTopHeader";
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

  return (
    <header className="w-full fixed top-0 z-50">
      {/* Second row: small bar with hamburger + search icons on left (and optional search input) */}
      <div className="hidden md:flex justify-between items-center w-full bg-[#f40607] px-14 py-2 shadow-sm">
        <div className="flex items-center">
          {/* left group */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="rounded transition"
            >
              <Menu size={36} className=" text-white hover:text-black" />
            </button>

            <Link to="/home">
              <img src={logo} alt="" className="h-11" />
            </Link>

            <div className="flex flex-col text-white border-l-2 border-white pl-4">
              <p className="text-3xl font-bold border-b border-white">Eminent News</p>
              <span className="text-xs">Empowering Wisdom</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search news..."
              className="rounded-lg pl-3 pr-10 py-1.5 w-full bg-white border-none text-red-600"
            />
            <Search className="text-black absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 " />
          </div>
          {currentUser ? (
            <div
              onClick={() => navigate("/my-profile")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src={profile} alt="" className="h-8 rounded-full" />
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

      <MobileTopHeader />

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

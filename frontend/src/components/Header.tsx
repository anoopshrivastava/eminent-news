import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-white.png";
import { Input } from "./ui/input";
import { Search, Menu} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "@/redux/authSlice";
import toast from "react-hot-toast";
import MobileMenu from "./MobileMenu";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import profile from "../assets/profile.webp";
import { useSearchParams } from "react-router-dom";


const Header = () => {
  const { currentUser } = useSelector((state: any) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [googleBarVisible, setGoogleBarVisible] = useState(false);

  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

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
  
const handleSearch = () => {
  const value = search.trim();

  if (!value) {
    navigate("/news"); // remove search param → show all news
    return;
  }

  navigate(`/news?search=${encodeURIComponent(value)}`);
};


  useEffect(() => {
    const interval = setInterval(() => {
      setGoogleBarVisible(Boolean((window as any).__googleTranslateVisible));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const querySearch = searchParams.get("search") || "";
  setSearch(querySearch);
}, [searchParams]);


  const avatar =
    currentUser?.avatar && currentUser?.avatar.trim() !== "sampleurl"
      ? currentUser.avatar
      : profile;

  return (
    <header
      className="w-full fixed z-50 transition-all duration-200"
      style={{ top: googleBarVisible ? "40px" : "0px" }}
    >
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
              <Menu
                size={32}
                className="hidden md:block text-white hover:text-black"
              />
              <Menu
                size={26}
                className="block md:hidden text-white hover:text-black"
              />
            </button>

            <div className="flex items-center gap-2">
              <Link to="/home">
                <img src={logo} alt="" className="h-7 md:h-9" />
              </Link>

              <div className="flex flex-col text-white -ml-1 md:ml-0 border-l-2 border-white pl-2 md:pl-3">
                <h3 className="text-[16px] md:text-3xl font-bold">
                  The Eminent News
                </h3>
                <h5 className="text-[10px] md:text-xs -mt-1 pl-1">
                  Empowering Wisdom
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0 md:gap-3">
          <div className="hidden md:block relative w-64">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              type="text"
              placeholder="Search news..."
              className="rounded-lg pl-3 pr-10 py-1.5 w-full bg-white border-none text-red-600"
            />

            <Search
              onClick={handleSearch}
              className="text-black absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer hover:scale-125"
            />
          </div>
          <div className="">
            <Search
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden text-white mr-3 cursor-pointer"
            />
          </div>
          {currentUser ? (
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 cursor-pointer "
            >
              <img src={avatar} alt="" className="h-10 w-10 rounded-full border-2 border-white" />
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

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 backdrop-blur-sm">
          <div className="mt-20 w-[90%] bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Input
                ref={mobileInputRef}
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    setMobileSearchOpen(false);
                  }
                }}
                placeholder="Search news..."
                className="flex-1"
              />

              <button
                onClick={() => {
                  handleSearch();
                  setMobileSearchOpen(false);
                }}
                className="bg-[#f40607] text-white px-4 py-2 rounded-md"
              >
                Search
              </button>
            </div>

            <button
              onClick={() => setMobileSearchOpen(false)}
              className="text-sm text-gray-500 mt-3 block text-center w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

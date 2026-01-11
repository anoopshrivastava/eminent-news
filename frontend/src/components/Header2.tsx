import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { categories, subCategoriesMap } from "../types/news";
import logo from "../assets/logo-white.png";
import profile from "../assets/profile.webp";
import MobileTopHeader from "./MobileTopHeader";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import {
//   signOutFailure,
//   signOutStart,
//   signOutSuccess,
// } from "@/redux/authSlice";
// import toast from "react-hot-toast";
// import api from "@/lib/axios";

const Header2 = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.user);

  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const handleLogout = async () => {
  //   try {
  //     dispatch(signOutStart());
  //     const response = await api.get("/logout");
  //     if (response.data.success === false) {
  //       dispatch(signOutFailure(response.data.message));
  //       toast.error(response.data.message);
  //       return;
  //     }
  //     console.log("Logout Success:", response.data);
  //     toast.success("Logout Successful");
  //     dispatch(signOutSuccess());
  //     navigate("/login");
  //   } catch (error: any) {
  //     console.log(error);
  //     dispatch(signOutFailure(error.message));
  //     toast.error(error.message);
  //   }
  // };

  const avatar = (currentUser.avatar && currentUser.avatar.trim() !== "sampleurl") ? currentUser.avatar : profile;

  return (
    <header className="fixed w-full z-50">
      <MobileTopHeader />

      {/* desktop header */}
      <div className="items-center justify-between py-2 hidden md:flex bg-[#f40607] text-white px-16 z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="TEN Logo" className="h-1" />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {categories.map((category) => (
            <div
              key={category}
              className="relative"
              onMouseEnter={() => setActiveMenu(category)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center gap-1 text-lg font-semibold hover:text-black relative">
                {category}
                <ChevronDown size={16} />
              </button>

              {/* Dropdown */}
              {activeMenu === category && (
                <div className=" absolute left-0 top-full w-48 rounded-md bg-white text-black font-semibold shadow-lg">
                  <ul className="py-2">
                    {subCategoriesMap[category].map((sub) => (
                      <li key={sub}>
                        <Link
                          // to={`/${category.toLowerCase().replace(/\s+/g, "-")}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                          to="#"
                          className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:opacity-80">
            <Search size={20} />
          </button>
          {currentUser ? (
            <div
              onClick={()=>navigate("/profile")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src={avatar} alt="" className="h-8 rounded-full"/>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-black px-3 pt-1 pb-1.5 hover:bg-black hover:text-white rounded-md flex items-center font-medium"
            >
              <span>Login</span>
              {/* <User size={20} /> */}
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header2;

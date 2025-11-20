import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { ProfileDropdown } from "./ProfileDropdown";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const Header = () => {
  return (
    <div className="hidden md:flex w-full items-center justify-between border-b border-gray-200 bg-white px-20 py-4 select-none fixed top-0 shadow-md z-50">
      
      {/* Left Section → Logo + Search */}
      <div className="flex items-center gap-6">
        <Link to="/">
          <img src={logo} alt="TEN Logo" className="h-9" />
        </Link>

        {/* Search Bar */}
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search news..."
            className="shadow-sm rounded-lg pl-4 pr-10 py-1.5 w-full transition"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Right Section → Links + Profile */}
      <div className="flex items-center gap-8">
        <Link
          to="/about-us"
          className="text-gray-700 hover:text-red-500 hover:underline transition font-medium"
        >
          About Us
        </Link>

        <Link
          to="/contact-us"
          className="text-gray-700 hover:text-red-500 transition hover:underline font-medium"
        >
          Contact Us
        </Link>

        <ProfileDropdown name="Unknown" />
      </div>

    </div>
  );
};

export default Header;

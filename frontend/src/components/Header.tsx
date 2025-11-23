import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Input } from "./ui/input";
import { Search, Menu } from "lucide-react";
import SwipeButton from "./SwipeButton";
import { Switch } from "./ui/switch";

const Header = () => {
  const today = new Date().toLocaleDateString();

  return (
    <header className="w-full fixed top-0 z-50">
      {/* Top big header row */}
      <div className="hidden md:flex items-center justify-between border-b border-gray-200 bg-white px-16 py-1 select-none shadow">
        {/* Left: Date + Logo */}
        <span className="text-lg text-gray-600 font-semibold">
          Date: {today}
        </span>

        <Link to="/" className="flex items-center">
          <img src={logo} alt="TEN Logo" className="h-9" />
        </Link>

        {/* Center: Title */}
        <div className="text-center">
          <h1 className="text-red-500 text-xl md:text-3xl font-extrabold tracking-tight">
            The Eminent News
          </h1>
          <div className="text-lg -mt-1 text-gray-500">Empowering wisdom</div>
        </div>

        <SwipeButton onSuccess={() => console.log("swiped")} />

        <div className="flex gap-3">
          {/* Right: Links (Login / Subscribe / Language) */}
          <ul className="flex flex-col  list-disc">
            <li>
              <Link
                to="/login"
                className="text-gray-700 hover:text-red-500 transition font-medium flex items-center gap-2"
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/subscribe"
                className="text-gray-700 hover:text-red-500 transition font-medium flex items-center gap-2"
              >
                Subscribe
              </Link>
            </li>
            <li>
              <button
                aria-label="Change language"
                className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition font-medium"
              >
                Language
              </button>
            </li>
          </ul>
          {/* If logged in, show profile dropdown instead of Login */}
          {/* <ProfileDropdown name="Unknown" /> */}
        </div>
      </div>

      {/* Second row: small bar with hamburger + search icons on left (and optional search input) */}
      <div className="hidden md:block w-full bg-red-500 px-16 py-2 shadow-sm">
        <div className="flex items-center mx-auto">
          {/* left group */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              className="pr-2 rounded hover:bg-gray-100 transition"
            >
              <Menu className="h-8 text-white" />
            </button>

            <button
              aria-label="Search"
              className="p-2 rounded bg-white hover:bg-gray-100 transition md:hidden"
            >
              <Search className="h-5 w-5 text-white" />
            </button>

            {/* On larger screens you might want a small inline search (optional) */}
            <div className="hidden md:block">
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Search news..."
                  className="rounded-lg pl-3 pr-10 py-1.5 w-full bg-white border-none"
                />
                <Search className="text-white absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 " />
              </div>
            </div>
          </div>

          {/* center / right of the second row (keeps space) */}
          <div className="flex-1" />
        </div>
      </div>

      {/* Mobile compact header (visible on small screens) */}
      <div className="md:hidden bg-white px-2 py-2 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            aria-label="Open menu"
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TEN Logo" className="h-8" />
            <span className="text-xs font-bold text-wrap max-w-16">
              Empowering Wisdom
            </span>
          </Link>
        </div>
        
        <div className="flex gap-2 items-center justify-center">
          <Switch />
          <button aria-label="Search" className="p-2 rounded hover:bg-gray-100">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "@/redux/authSlice";
import toast from "react-hot-toast";
import api from "@/lib/axios";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const nav = [
    { label: "News", href: "/editor/news" },
    { label: "Shorts", href: "/editor/shorts" },
    { label: "Videos", href: "/editor/videos" },
    { label: "Ads", href: "/editor/ads" },
    { label: "Profile", href: "/profile" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const response = await api.post(`/logout`);
      if (response.data.success === false) {
        dispatch(signOutFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }
      toast.success("Logout Successful");
      dispatch(signOutSuccess());
      navigate("/login");
    } catch (error: any) {
      dispatch(signOutFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* 🍔 Mobile menu button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-md"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-50
          min-w-64 bg-white border-r border-[#62b179]/15 shadow-2xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4">
          <h1 className="text-[#f40607] text-xl font-bold">
            Editor Dashboard
          </h1>

          {/* ❌ Close (mobile only) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex flex-col px-4 gap-3 py-4">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 font-semibold rounded-sm transition-colors duration-300
                ${
                  isActive
                    ? "bg-[#ef6262] text-white border-l-4 border-black"
                    : "hover:bg-gray-200 border-l-4 hover:border-gray-500 border-transparent"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-auto px-4 pb-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 font-semibold rounded-sm hover:bg-gray-200 border-l-4 hover:border-black border-transparent text-left"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

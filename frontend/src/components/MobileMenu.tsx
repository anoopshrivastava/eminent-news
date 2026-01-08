import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronUp, ArrowRight, Trash2 } from "lucide-react";
import logo from "../assets/logo.png";
import { categories, subCategoriesMap } from "@/types/news";
import { User, Lock } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";


interface Props {
  open: boolean;
  onClose: () => void;
  currentUser?: any;
  handleLogout?: () => void;
}


const MobileMenu = ({ open, onClose, currentUser, handleLogout }: Props) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openAccount, setOpenAccount] = useState(false);
  const navigate = useNavigate()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    // @ts-ignore
    window.setSiteLanguage?.(lang);
    onClose()
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await api.delete("/me", { withCredentials: true });

      toast.success("Account deleted successfully");

      handleLogout?.(); // clear auth state, tokens, store
      onClose();
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to delete account"
      );
    }
  };



  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-screen w-72 bg-white shadow-lg p-5 flex flex-col overflow-y-scroll">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img src={logo} alt="TEN Logo" className="h-9" />
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col gap-4 text-lg font-semibold">
          <span 
            onClick={()=>{
              onClose();
              navigate("/shorts")
            }} 
            className="hidden cursor-pointer md:flex items-center gap-2 hover:text-[#f40607] hover:underline">Shorts <ArrowRight size={22} className="mt-0.5"/></span>
          {categories.map((category) => {
            const isOpen = openCategory === category;
            return (
              <div key={category}>
                {/* Category row */}
                <button
                  onClick={() =>
                    setOpenCategory(isOpen ? null : category)
                  }
                  className="flex justify-between items-center w-full hover:text-[#f40607]"
                >
                  {category}
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {/* Subcategories */}
                {isOpen && (
                  <div className="ml-3 mt-2 flex flex-col gap-3 text-base font-medium text-gray-700">
                    {subCategoriesMap[category].map((sub) => (
                      <Link
                        key={sub}
                        to={`/category/${category.toLowerCase()}/${sub.toLowerCase()}`}
                        onClick={onClose}
                        className="hover:text-[#f40607]"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-4">
            <label className="text-sm text-rose-600 mb-1 block">
              Select Language :
            </label>

            <select
              defaultValue="en"
              onChange={handleLanguageChange}
              className="w-full border bg-white cursor-pointer border-gray-300 rounded px-3 py-2"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {/* My Account (Authenticated Users Only) */}
          {currentUser && (
            <div className="mt-4">
              <button
                onClick={() => setOpenAccount(!openAccount)}
                className="flex justify-between items-center w-full hover:text-[#f40607]"
              >
                My Account
                {openAccount ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {openAccount && (
                <div className="ml-3 mt-3 flex flex-col gap-3 text-base font-medium text-gray-700">
                  <button
                    onClick={() => {
                      navigate("/settings/profile");
                      onClose();
                    }}
                    className="flex items-center gap-2 hover:text-[#f40607]"
                  >
                    <User size={16} />
                    Edit Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings/security");
                      onClose();
                    }}
                    className="flex items-center gap-2 hover:text-[#f40607]"
                  >
                    <Lock size={16} />
                    Change Password
                  </button>
                </div>
              )}

              {openAccount && (
                <div className="ml-3 mt-3 flex flex-col gap-3 text-base font-medium text-gray-700">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                    Delete My Account
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Login / Logout */}
          {currentUser ? (
            <button
              onClick={() => {
                handleLogout?.();
                onClose();
              }}
              className="text-left hover:text-[#f40607] mt-4"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={onClose} className="hover:text-[#f40607] mt-4">
              Login
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 text-sm text-gray-500">
          © 2025 The Eminent News
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

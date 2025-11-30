import { Link } from "react-router-dom";
import { X } from "lucide-react";
import logo from "../assets/logo.png";

interface Props {
  open: boolean;
  onClose: () => void;
  currentUser?: any;
  handleLogout?: () => void;
}

const MobileMenu = ({ open, onClose, currentUser, handleLogout }: Props) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-lg p-5 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img src={logo} alt="TEN Logo" className="h-12" />
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col gap-4 text-base font-medium">
          <Link to="/" onClick={onClose} className="hover:text-red-500">
            Home
          </Link>

          <Link to="#" onClick={onClose} className="hover:text-red-500">
            Subscribe
          </Link>

          <Link to="#" onClick={onClose} className="hover:text-red-500">
            Language
          </Link>

          {currentUser ? (
            <button
              onClick={() => {
                handleLogout?.();
                onClose();
              }}
              className="text-left hover:text-red-500"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={onClose} className="hover:text-red-500">
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

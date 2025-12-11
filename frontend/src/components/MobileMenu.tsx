import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import logo from "../assets/logo.png";

interface Props {
  open: boolean;
  onClose: () => void;
  currentUser?: any;
  handleLogout?: () => void;
}

export const categories = [
  "National",
  "World",
  "Trending",
  "Sports",
  "Entertainment",
  "Education",
];

const subCategoriesMap: Record<string, string[]> = {
  National: ["Daily Short News", "State News", "Government Scheme", "Economy & Business", "Judicial News", "Social Justice", "Indian Society", "Internal Security", "Editorial", "Essays"],
  World: ["World News", "Bilateral Relations", "World Organizations", "World Indexes & Reports","Conferences, meeting & Summits", "Space Technology", "Defense News", "Innovation & Technology", "Environment"],
  Trending: ["Viral News", "Social Media", "Tech Buzz", "Top Stories"],
  Sports: ["Indian Sports", "Team 11", "Athelatic Events", "Olympic Games", "Sports Persons"],
  Entertainment: ["Bollywood", "Hollywood", "TV Shows", "Celebrities"],
  Education: ["Exam Notification", "Job Notification", "Q/A", "Magazines", "Podcast", "TEN updates"],
};

const MobileMenu = ({ open, onClose, currentUser, handleLogout }: Props) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

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
        <nav className="flex flex-col gap-4 text-lg font-semibold">
          {categories.map((category) => {
            const isOpen = openCategory === category;
            return (
              <div key={category}>
                {/* Category row */}
                <button
                  onClick={() =>
                    setOpenCategory(isOpen ? null : category)
                  }
                  className="flex justify-between items-center w-full hover:text-red-500"
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
                        className="hover:text-red-500"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Login / Logout */}
          {currentUser ? (
            <button
              onClick={() => {
                handleLogout?.();
                onClose();
              }}
              className="text-left hover:text-red-500 mt-4"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={onClose} className="hover:text-red-500 mt-4">
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

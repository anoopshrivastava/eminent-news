import { Switch } from "./ui/switch";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Search, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signOutFailure, signOutStart, signOutSuccess } from "@/redux/authSlice";
import toast from "react-hot-toast";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import api from "@/lib/axios";

const MobileTopHeader = () => {

    const {currentUser} = useSelector((state:any)=>state.user);
  
    const [menuOpen, setMenuOpen] = useState(false);
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleLogout = async () => {
      try {
        dispatch(signOutStart());
        const response = await api.post("/logout");
        if (response.data.success === false) {
          dispatch(signOutFailure(response.data.message));
          toast.error(response.data.message);
          return;
        }
        console.log("Logout Success:", response.data);
        toast.success("Logout Successful");
        dispatch(signOutSuccess());
        navigate('/login');
      } catch (error:any) {
        console.log(error);
        dispatch(signOutFailure(error.message));
        toast.error(error.message);
      }
    };

  return (
    <div>
              {/* Mobile compact header (visible on small screens) */}
      <div className="md:hidden bg-white px-2 py-2 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={()=>setMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TEN Logo" className="h-8" />
            <h3 className="text-xs font-bold text-wrap max-w-16">
              Empowering Wisdom
            </h3>
          </Link>
        </div>
        
        <div className="flex gap-2 items-center justify-center">
          <Switch />
          <button aria-label="Search" className="p-2 rounded hover:bg-gray-100">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />
    </div>
  )
}

export default MobileTopHeader
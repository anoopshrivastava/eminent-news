import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, Settings, ChevronDown, User } from "lucide-react";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleApiError";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ProfileDropdown({name}:{name:string}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    try {
      // await logout();
      localStorage.removeItem("access_token")
      toast.success("Logout Success");
      navigate("/login");
    } catch (error) {
      handleApiError(error);
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <div className="flex gap-1 md:gap-2 items-center cursor-pointer">
            <User/>
            <span className="flex items-center font-semibold gap-1">
              {name} <ChevronDown className="hidden md:flex w-4 mt-1" />
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => navigate("/my-profile")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-[#f40607] focus:text-[#f40607]"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

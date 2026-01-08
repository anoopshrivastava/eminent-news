import React from "react";
import { Edit2, Mail, MapPin, LogOutIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "@/redux/authSlice";
import profile from "@/assets/profile.webp"
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import toast from "react-hot-toast";

type User = {
  _id?: string;
  name?: string;
  username?: string,
  address?: string,
  email?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role?: string;
  phone?: string;
  followers?: Array<any>;
  following?: Array<any>;
  createdAt?: string;
};

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

const ProfilePage: React.FC = () => {
  const { currentUser } = useSelector((state: any) => state.user || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("current",currentUser)

  // fallback profile when currentUser is not yet available
  const user: User = currentUser || {
    _id: "",
    name: "Unknown",
    email: "unknown@gmail.com",
    avatar: profile,
    role: "user",
    phone: "",
    followers: [],
    following: [],
    createdAt: new Date().toISOString(),
  };

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

  const followersCount = (user.followers && user.followers.length) || 0;
  const followingCount = (user.following && user.following.length) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 min-h-[80vh]">
      {/* header */}
      <div className="flex flex-row md:items-center gap-6 md:gap-8 pt-2 md:pt-4">
        <div className="flex-shrink-0">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-200">
            <img src={user?.avatar || profile} alt={user.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">{user.name}</h1>
              <h3 className="text-gray-500 text-sm">{user?.username ?? "-"}</h3>
            </div>

            {/* actions */}
            <div className="ml-auto flex items-center gap-2">
             <button
              onClick={() => navigate("/settings/profile")}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:shadow-sm transition bg-white"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>

              {/* <button className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50 transition">
                <Share2 size={16} />
                Share
              </button> */}

              <button 
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-tr from-red-500 to-pink-500 text-white rounded-md shadow-sm hover:opacity-95 transition">
                <LogOutIcon size={16} />
                <span className="hidden md:block">Logout</span>
              </button>
            </div> 
          </div>

          {/* stats */}
          <div className="mt-4 md:mt-6 flex items-center gap-6 border-b border-gray-200 pb-5">
            {/* <div>
              <div className="font-semibold text-gray-900">12</div>
              <div className="text-gray-500">Posts</div>
            </div> */}
            <div>
              <div className="font-semibold text-gray-900 text-center">{followersCount}</div>
              <div className="text-gray-500">Followers</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-center">{followingCount}</div>
              <div className="text-gray-500">Following</div>
            </div>
          </div>

          {/* bio desktop */}
          <div className="hidden md:block mt-4 text-gray-700">
            <p className="font-medium">{user.name} • {user.role}</p>
            <p className="text-sm text-gray-600">Joined {formatDate(user.createdAt)}</p>
            <p className="mt-6 text-gray-600">{user.bio ?? "This is a short bio. Add your location, interests or a short description here."}</p>

            <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
              {user.phone && (
                <div className="flex items-center gap-1">
                  <Mail size={14} />
                  <span>{user.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{user.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bio - mobile view */}
      <div className="block md:hidden mt-4 text-gray-700">
            <p className="font-medium text-lg">{user.name} • {user.role}</p>
            <p className="text-sm text-gray-600">Joined {formatDate(user.createdAt)}</p>
            <p className="mt-5 text-gray-600 text-sm">{user.bio ?? "This is a short bio. Add your location, interests or a short description here."}</p>

            <div className="mt-5 flex items-center gap-3 text-gray-600">
              {user.phone && (
                <div className="flex items-center gap-1">
                  <Mail size={14} />
                  <span>{user.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{user.address}</span>
              </div>
            </div>
          </div>
    </div>
  );
};

export default ProfilePage;

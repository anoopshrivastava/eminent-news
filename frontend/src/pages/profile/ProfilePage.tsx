import React, { useEffect, useState } from "react";
import { Edit2, Mail, MapPin, LogOut, Megaphone } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "@/redux/authSlice";
import profile from "@/assets/profile.webp";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Trash2, Lock } from "lucide-react";
import { deleteAccount } from "@/lib/accountAction";
import { FiLoader } from "react-icons/fi";

type User = {
  _id?: string;
  name?: string;
  username?: string;
  address?: string;
  email?: string;
  avatar?: string;
  bio?: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      navigate("/login");
    } catch (error: any) {
      console.log(error);
      dispatch(signOutFailure(error.message));
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        const res = await api.get("/me");

        if (res.data?.success) {
          setUser(res.data.user);
        } else {
          toast.error("Failed to load profile");
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const followersCount = (user?.followers && user.followers.length) || 0;
  const followingCount = (user?.following && user.following.length) || 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FiLoader className="animate-spin text-indigo-600 text-3xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Failed to load user profile
      </div>
    );
  }

  const avatar =
    user.avatar && user.avatar.trim() !== "sampleurl" ? user.avatar : profile;

const AccountActions = ({ mobile = false }: { mobile?: boolean }) => (
  <div className={`flex ${mobile ? "flex-col gap-3" : "flex-row gap-2"}`}>
    
    {/* Run My Ads */}
    <button
      onClick={() => navigate("/profile/my-ads")}
      className={`flex items-center gap-2 ${
        mobile ? "w-full justify-center px-5 py-3.5" : "px-4 py-2"
      } bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg
      hover:from-rose-600 hover:to-rose-700 transition-all duration-200
      font-medium shadow-md hover:shadow-lg`}
    >
      <Megaphone size={18} />
      Run My Ads
    </button>

    {/* Edit Profile */}
    <button
      onClick={() => navigate("/settings/profile")}
      className={`flex items-center gap-2 ${
        mobile ? "w-full justify-center px-5 py-3.5" : "px-4 py-2"
      } bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 font-medium text-gray-700 hover:text-indigo-600 shadow-sm`}
    >
      <Edit2 size={18} />
      Edit Profile
    </button>

    {/* Change Password */}
    <button
      onClick={() => navigate("/settings/security")}
      className={`flex items-center gap-2 ${
        mobile ? "w-full justify-center px-5 py-3.5" : "px-4 py-2"
      } bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 font-medium text-gray-700 hover:text-indigo-600 shadow-sm`}
    >
      <Lock size={18} />
      Change Password
    </button>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 ${
        mobile ? "w-full justify-center px-5 py-3.5" : "px-4 py-2"
      } bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg`}
    >
      <LogOut size={18} />
      Logout
    </button>

    {/* Delete Account */}
    <button
      onClick={() => deleteAccount(handleLogout, () => navigate("/login"))}
      className={`flex items-center gap-2 ${
        mobile ? "w-full justify-center px-5 py-3.5" : "px-4 py-2"
      } bg-white border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 font-medium shadow-sm`}
    >
      <Trash2 size={18} />
      Delete Account
    </button>
  </div>
);


  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 min-h-[80vh]">
      {/* header */}
      <div className="flex flex-row md:items-center gap-6 md:gap-8 pt-2 md:pt-8">
        <div className="flex-shrink-0">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse opacity-75"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img
                src={avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {user.name}
              </h1>
              <h3 className="text-gray-500 text-sm">{user?.username ?? "-"}</h3>
            </div>

            {/* actions */}
            <div className="hidden md:flex ml-auto">
              <AccountActions />
            </div>
          </div>

          {/* stats */}
          <div className="mt-4 md:mt-6 flex items-center gap-6 border-b border-gray-200 pb-5">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
                {followersCount}
              </div>
              <div className="text-gray-500">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                {followingCount}
              </div>
              <div className="text-gray-500">Following</div>
            </div>
          </div>

          {/* bio desktop */}
          <div className="hidden md:block mt-4 text-gray-700">
            <p className="font-medium">
              {user.name} • {user.role}
            </p>
            <p className="text-sm text-gray-600">
              Joined {formatDate(user.createdAt)}
            </p>
            <p className="mt-6 text-gray-600">
              {user.bio ??
                "This is a short bio. Add your location, interests or a short description here."}
            </p>

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
        <p className="font-medium text-lg">
          {user.name} • {user.role}
        </p>
        <p className="text-sm text-gray-600">
          Joined {formatDate(user.createdAt)}
        </p>
        <p className="mt-5 text-gray-600 text-sm">
          {user.bio ??
            "This is a short bio. Add your location, interests or a short description here."}
        </p>

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
      <div className="block md:hidden mt-6">
        <AccountActions mobile />
      </div>
    </div>
  );
};

export default ProfilePage;

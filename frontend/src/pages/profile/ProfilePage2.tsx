import React from "react";
import { Edit2, Mail, MapPin, LogOut, Trash2, Lock, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "@/redux/authSlice";
import profile from "@/assets/profile.webp";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { deleteAccount } from "@/lib/accountAction";

type User = {
  _id?: string;
  name?: string;
  username?: string;
  address?: string;
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
  console.log("current", currentUser);

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

  const avatar =
    currentUser.avatar && currentUser.avatar.trim() !== "sampleurl"
      ? currentUser.avatar
      : profile;

  const AccountActions = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex ${mobile ? "flex-col gap-3" : "flex-row gap-2"}`}>
      <button
        onClick={() => navigate("/settings/profile")}
        className={`flex items-center gap-2 ${
          mobile ? "w-full justify-center px-5 py-3.5" : "px-4 py-2"
        } bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 font-medium text-gray-700 hover:text-indigo-600 shadow-sm`}
      >
        <Edit2 size={18} />
        Edit Profile
      </button>

      <button
        onClick={() => navigate("/settings/security")}
        className={`flex items-center gap-2 ${
          mobile ? "w-full justify-center px-5 py-3.5" : "px-4 py-2"
        } bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 font-medium text-gray-700 hover:text-indigo-600 shadow-sm`}
      >
        <Lock size={18} />
        Change Password
      </button>

      <button
        onClick={handleLogout}
        className={`flex items-center gap-2 ${
          mobile ? "w-full justify-center px-5 py-3.5" : "px-4 py-2"
        } bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg`}
      >
        <LogOut size={18} />
        Logout
      </button>

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
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 min-h-[80vh]">
      {/* Mobile Header with Gradient Background */}
      <div className="md:hidden -mx-4 px-4 pb-6 pt-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 mb-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar with animated border */}
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

          {/* Name and Username */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            {user.name}
          </h1>
          <p className="text-gray-600 font-medium mb-1">@{user?.username ?? "user"}</p>
          <span className="inline-block px-4 py-1 bg-white rounded-full text-sm font-semibold text-indigo-600 shadow-sm border border-indigo-100">
            {user.role}
          </span>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-6 bg-white rounded-2xl px-8 py-4 shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {followersCount}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">Followers</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {followingCount}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex flex-row items-center gap-8 pt-4">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse opacity-50"></div>
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl">
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
              <h1 className="text-3xl font-bold text-gray-800">
                {user.name}
              </h1>
              <p className="text-gray-500 font-medium">@{user?.username ?? "user"}</p>
            </div>

            {/* actions */}
            <div className="hidden md:flex ml-auto">
              <AccountActions />
            </div>
          </div>

          {/* stats */}
          <div className="mt-6 flex items-center gap-8 pb-6 border-b border-gray-200">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {followersCount}
              </div>
              <div className="text-sm text-gray-500 font-medium">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {followingCount}
              </div>
              <div className="text-sm text-gray-500 font-medium">Following</div>
            </div>
          </div>

          {/* bio desktop */}
          <div className="hidden md:block mt-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                  {user.role}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                {user.bio ??
                  "This is a short bio. Add your location, interests or a short description here."}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                {user.phone && (
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg">
                    <Mail size={14} className="text-indigo-500" />
                    <span>{user.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg">
                  <MapPin size={14} className="text-indigo-500" />
                  <span>{user.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bio - mobile view */}
      <div className="block md:hidden">
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 mb-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Calendar size={14} />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed text-sm mb-4">
            {user.bio ??
              "This is a short bio. Add your location, interests or a short description here."}
          </p>

          <div className="flex flex-col gap-2 text-sm">
            {user.phone && (
              <div className="flex items-center gap-2 text-gray-600 bg-indigo-50 px-3 py-2 rounded-lg">
                <Mail size={16} className="text-indigo-500" />
                <span>{user.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600 bg-indigo-50 px-3 py-2 rounded-lg">
              <MapPin size={16} className="text-indigo-500" />
              <span>{user.address}</span>
            </div>
          </div>
        </div>

        <AccountActions mobile />
      </div>
    </div>
  );
};

export default ProfilePage;
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import profile from "@/assets/profile.webp";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import { Avatar } from "@/components/ui/avatar";
import type { Editor, News } from "@/types/news";
import PostX from "@/components/PostX";
import { useSelector } from "react-redux";

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

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state: any) => state.user);

  const [isProfileFollowed, setIsProfileFollowed] = useState(false);
  const [loadingProfileFollow, setLoadingProfileFollow] = useState(false);

  const [followingIds, setFollowingIds] = useState<Record<string, boolean>>({});
  const [loadingFollow, setLoadingFollow] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();

  const [editors, setEditors] = useState<Editor[]>([]);
  const [editorsLoading, setEditorsLoading] = useState(false);

  const fetchEditors = async () => {
    setEditorsLoading(true);
    try {
      // Request a small set; change query params as your API supports.
      const res = await api.get("/editors/suggestion?limit=7&verified=true");
      const data = res?.data ?? {};
      const list: Editor[] = data.users ?? data.editors ?? [];

      // If backend already limits/sorts, we'll just take first 5; otherwise sort by createdAt desc
      const filtered = list.filter((ed) => ed._id !== id);
      setEditors(filtered.slice(0, 5));

    } catch (err) {
      console.error("Error fetching editors:", err);
      setEditors([]);
    } finally {
      setEditorsLoading(false);
    }
  };

  const handleFollow = async (
    userId: string,
    type: "profile" | "suggestion"
  ) => {
    if (!currentUser) {
      toast.error("Please Login First !!");
      navigate("/login");
      return;
    }

    // ---- PROFILE FOLLOW ----
    if (type === "profile") {
      if (loadingProfileFollow || !user || currentUser._id === user._id) return;

      const willFollow = !isProfileFollowed;
      setLoadingProfileFollow(true);
      setIsProfileFollowed(willFollow);

      try {
        const res = await api.put(`/user/${userId}/follow`);
        toast.success(
          res?.data?.message || (willFollow ? "Following" : "Unfollowed")
        );

        // update followers count
        setUser((prev) =>
          prev
            ? {
                ...prev,
                followers: willFollow
                  ? [...(prev.followers || []), { user: currentUser._id }]
                  : (prev.followers || []).filter(
                      (f: any) => String(f.user) !== String(currentUser._id)
                    ),
              }
            : prev
        );
      } catch (err: any) {
        setIsProfileFollowed(!willFollow);
        toast.error(err?.response?.data?.message || "Failed to toggle follow");
      } finally {
        setLoadingProfileFollow(false);
      }

      return;
    }

    // ---- SUGGESTION FOLLOW ----
    if (loadingFollow[userId]) return;

    const willFollow = !followingIds[userId];
    setLoadingFollow((p) => ({ ...p, [userId]: true }));
    setFollowingIds((p) => ({ ...p, [userId]: willFollow }));

    try {
      const res = await api.put(`/user/${userId}/follow`);
      toast.success(
        res?.data?.message || (willFollow ? "Following" : "Unfollowed")
      );
    } catch (err: any) {
      setFollowingIds((p) => ({ ...p, [userId]: !willFollow }));
      toast.error(err?.response?.data?.message || "Failed to toggle follow");
    } finally {
      setLoadingFollow((p) => ({ ...p, [userId]: false }));
    }
  };


  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${id}`);

        if (res.data?.success) {
          setUser(res.data.user);
          setNews(res.data.news || []);
        } else {
          toast.error("Failed to load profile");
        }
      } catch (err: any) {
        console.error(err);

        const status = err?.response?.status;

        if (status === 404) {
          toast.error("User not found");
          navigate("/404", { replace: true });
          return;
        }

        toast.error(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchEditors();
  }, [id]);

  useEffect(() => {
    if (!currentUser || !user) return;

    const myId = currentUser._id;

    const isFollowing =
      Array.isArray(user.followers) &&
      user.followers.some((f: any) => String(f.user) === String(myId));

    setIsProfileFollowed(isFollowing);
  }, [currentUser, user]);

  useEffect(() => {
    if (!currentUser?._id || editors.length === 0) return;

    const map: Record<string, boolean> = {};
    const myId = currentUser._id;

    for (const ed of editors) {
      map[ed._id] =
        Array.isArray(ed.followers) &&
        ed.followers.some((f: any) => String(f.user) === String(myId));
    }

    setFollowingIds(map);
  }, [currentUser?._id, editors]);


  const followersCount = user?.followers?.length ?? 0;
  const followingCount = user?.following?.length ?? 0;

  const renderInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    const initials = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
    return initials.toUpperCase();
  };

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

  const avatar = user.avatar && user.avatar.trim() !== "sampleurl" ? user.avatar : profile;

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
              <div className="flex gap-3 items-center">
                <h1 className="text-2xl md:text-3xl font-semibold">
                {user.name}
              </h1>
                {currentUser?._id !== user._id && (
                <button
                  onClick={()=>handleFollow(user._id!, "profile")}
                  disabled={loadingProfileFollow}
                  className={`hidden md:block px-4 py-1.5 text-sm rounded-full border font-medium transition ${
                    isProfileFollowed
                      ? "bg-[#f40607] text-white border-[#f40607]"
                      : "text-[#f40607] border-[#f40607] bg-white"
                  }`}
                >
                  {loadingProfileFollow
                    ? "..."
                    : isProfileFollowed
                    ? "Following"
                    : "Follow"}
                </button>
              )}
              </div>
              
              <h3 className="text-gray-500 text-sm">{user?.username ?? "-"}</h3>

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

          {currentUser?._id !== user._id && (
            <button
              onClick={()=>handleFollow(user._id!, "profile")}
              disabled={loadingProfileFollow}
              className={`block md:hidden w-full px-4 py-1.5 text-sm rounded-lg border font-medium transition ${
                isProfileFollowed
                  ? "bg-[#f40607] text-white border-[#f40607]"
                  : "text-[#f40607] border-[#f40607] bg-white"
              }`}
            >
              {loadingProfileFollow
                ? "..."
                : isProfileFollowed
                ? "Following"
                : "Follow"}
            </button>
          )}

          {/* bio desktop */}
          <div className="hidden md:block text-gray-700">
            <p className="mt-2 text-gray-600">
              {user.bio ??
                "This is a short bio. Add your location, interests or a short description here."}
            </p>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{user.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* bio - mobile view */}
      <div className="block md:hidden text-gray-700">
        <p className="mt-5 text-gray-600 text-sm">
          {user.bio ??
            "This is a short bio. Add your location, interests or a short description here."}
        </p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={14} />
            <span>{user.address}</span>
          </div>
      </div>
      

      {/* ===== Who to follow && news (shared with HomePage) ===== */}
      <div className="mt-6 border-t pt-6">
        <div className="md:flex md:justify-between md:items-start gap-6">
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
            
            {news.map((item) => (
              <PostX key={item._id} news={item} hideHeader={true} />
            ))}
            {news.length === 0 && <span className="text-center text-gray-500">No Posts Available</span>}
        
          </div>

          <aside className="md:w-1/3 mt-6 md:mt-0">
            <div className="rounded-lg bg-white shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">Follow Suggestions</h4>
              </div>

              {editorsLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : editors.length === 0 ? (
                <p className="text-sm text-gray-500">No suggestions found.</p>
              ) : (
                <div className="space-y-3">
                  {editors.map((ed) => (
                    <div
                      key={ed._id}
                      className="flex items-center justify-between gap-3"
                    >
                      <Link to={`/profile/${ed._id}`} className="flex items-center gap-3">
                        {ed.avatar ? (
                          <Avatar className="w-10 h-10">
                            <img src={ed.avatar} alt={ed.name} />
                          </Avatar>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                            {renderInitials(ed.name)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {ed.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            @{ed.username}
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFollow(ed._id, "suggestion")}
                          disabled={loadingFollow[ed._id]}
                          className={`px-3 py-1 text-sm rounded-full border font-medium ${
                            followingIds[ed._id]
                              ? "bg-[#f40607] text-white border-[#f40607]"
                              : "text-[#f40607] border-[#f40607] bg-white"
                          }`}
                        >
                          {followingIds[ed._id] ? "Following" : "Follow"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      {/* ===== end Who to follow ===== */}
    </div>
  );
};

export default UserProfile;

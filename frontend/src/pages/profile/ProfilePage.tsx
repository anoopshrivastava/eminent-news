import React from "react";
import { Edit2, Settings, Mail, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import profile from "@/assets/profile.webp"

type User = {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
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

// const PlaceholderGrid: React.FC<{ count?: number; imageSrc?: string }> = ({
//   count = 9,
//   imageSrc = "/placeholder.png",
// }) => {
//   const arr = Array.from({ length: count }).map((_, i) => i);
//   return (
//     <div className="grid grid-cols-3 gap-1 md:gap-2">
//       {arr.map((i) => (
//         <div
//           key={i}
//           className="relative aspect-square w-full bg-gray-100 overflow-hidden rounded-sm"
//         >
//           <img
//             src={imageSrc}
//             alt={`post-${i}`}
//             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

const ProfilePage: React.FC = () => {
  const { currentUser } = useSelector((state: any) => state.user || {});
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

  const followersCount = (user.followers && user.followers.length) || 0;
  const followingCount = (user.following && user.following.length) || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 min-h-[80vh]">
      {/* header */}
      <div className="flex flex-row md:items-center gap-6 md:gap-8 pt-2">
        <div className="flex-shrink-0">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-gray-200">
            <img src={profile} alt={user.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-semibold">{user.name}</h1>

            {/* actions */}
            {/* <div className="ml-auto flex items-center gap-2">
              <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:shadow-sm transition bg-white">
                <Edit2 size={16} />
                Edit Profile
              </button>

              <button className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50 transition">
                <Share2 size={16} />
                Share
              </button>

              <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-tr from-red-500 to-pink-500 text-white rounded-md shadow-sm hover:opacity-95 transition">
                <UserPlus size={16} />
                Follow
              </button>
            </div> */}
          </div>

          {/* stats */}
          <div className="mt-4 flex items-center gap-6 ">
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
            <p className="text-sm text-gray-600 mt-1">Joined {formatDate(user.createdAt)}</p>
            <p className="mt-3 text-gray-600">This is a short bio. Add your location, interests or a short description here.</p>

            <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
              {user.phone && (
                <div className="flex items-center gap-1">
                  <Mail size={14} />
                  <span>{user.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>Earth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bio - mobile view */}
      <div className="block md:hidden mt-4 text-gray-700">
            <p className="font-medium text-lg">{user.name} • {user.role}</p>
            <p className="text-sm text-gray-600 mt-1">Joined {formatDate(user.createdAt)}</p>
            <p className="mt-3 text-gray-600 text-sm">This is a short bio. Add your location, interests or a short description here.</p>

            <div className="mt-3 flex items-center gap-3 text-gray-600">
              {user.phone && (
                <div className="flex items-center gap-1">
                  <Mail size={14} />
                  <span>{user.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>Earth</span>
              </div>
            </div>
          </div>

      {/* tabs */}
      {/* <div className="mt-6 border-b border-gray-100">
        <div className="flex gap-6 text-sm md:text-base text-gray-600">
          <button className="pb-3 border-b-2 border-red-500 text-red-500">Posts</button>
          <button className="pb-3 hover:text-gray-900">Saved</button>
          <button className="pb-3 hover:text-gray-900">Tagged</button>
        </div>
      </div> */}

      {/* posts grid */}
      {/* <div className="mt-4">
        <PlaceholderGrid count={9} imageSrc={profile} />
      </div> */}

      {/* mobile sticky action */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center md:hidden">
        <div className="bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1 rounded-md">
            <Edit2 size={16} />
            Edit
          </button>
          <button className="flex items-center gap-2 px-3 py-1 rounded-md">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

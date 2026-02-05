import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import api from "@/lib/axios";
import { useSearchParams } from "react-router-dom";
import type { FetchUsersResponse, User } from "../admin/AllUsers";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";

const UserSearch: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const navigate = useNavigate();
  const LIMIT = 200;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<FetchUsersResponse>(
        `/users?searchKey=${search}&limit=${LIMIT}`
      );

      if (response.data?.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching Users:", error);
      toast.error("Error fetching Users. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) fetchUsers();
  }, [search]);

  const renderInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    const initials = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
    return initials.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-6">
      {/* Header */}
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        Results for <span className="text-red-600">@{search}</span>
      </h2>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">No users found</p>
          <p className="text-sm mt-1">Try a different username</p>
        </div>
      )}

      {/* User list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <Avatar className="w-10 h-10">
                  <img src={user.avatar} alt={user.name} />
                </Avatar>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {renderInitials(user.name)}
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 leading-tight">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">@{user.username}</p>

              <div className="flex gap-4 mt-1 text-xs text-gray-600">
                <span>
                  <strong>{user.followers?.length || 0}</strong> followers
                </span>
                <span>
                  <strong>{user.following?.length || 0}</strong> following
                </span>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => navigate(`/profile/${user._id}`)}
              className="text-sm bg-[#f40607] text-white px-3 py-1.5 rounded-md hover:bg-black transition"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;

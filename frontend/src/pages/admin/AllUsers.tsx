import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiTrash2, FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchInput from "../../components/SearchInput";
import useDebounce from "@/lib/useDebounce";
// import UpdateUserModal from "./UpdateUserModal"; // ensure correct import

// ---------- TYPES ----------
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  followers:string[];
  following:string[];
  createdAt: string;
}

interface FetchUsersResponse {
  success: boolean;
  users: User[];
}

function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  // const [editingEditor, setEditingEditor] = useState<Editor | null>(null);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search, 500);

  // ---------- FETCH EDITORS ----------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get<FetchUsersResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/users?searchKey=${search}`,
        { withCredentials: true }
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

  // ---------- DELETE USER ----------
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this User?")) return;

    setDeleting(id);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/user/${id}`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user. Try again.");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch]);

  return (
    <div className="flex-1 flex-col min-h-screen">
      <div className="flex items-center gap-3 mb-4 mt-2">
        <div className="flex items-center justify-between pr-10">
          <h1 className="text-3xl font-bold text-blue-600">All Users</h1>
        </div>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          isLoading={loading}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FiLoader className="animate-spin text-blue-700 text-4xl" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No User Found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="py-3 px-2 text-left">Name</th>
                <th className="py-3 px-2 text-left">Email</th>
                <th className="py-3 px-2 text-left">Phone</th>
                <th className="py-3 px-2 text-left">Following</th>
                <th className="py-3 px-2 text-left">Followers</th>
                <th className="py-3 px-2 text-left">Joined On</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-blue-50">
                  <td className="py-3 px-2">{user.name}</td>
                  <td className="py-3 px-2">{user.email}</td>
                  <td className="py-3 px-2">{user.phone}</td>

                  <td className="py-3 px-2">{user.following.length}</td>
                  <td className="py-3 px-2">{user.followers.length}</td>

                  <td className="py-3 px-2">{user.createdAt.split("T")[0]}</td>

                  <td className="py-3 px-2 text-center flex justify-center gap-4">
                    {/* Edit */}
                    {/* <button
                      onClick={() => setEditingEditor(user)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit User"
                    >
                      <FiEdit />
                    </button> */}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={deleting === user._id}
                      title="Delete User"
                    >
                      {deleting === user._id ? (
                        <FiLoader className="animate-spin text-red-500" />
                      ) : (
                        <FiTrash2 />
                      )}
                    </button>

                    {/* Copy ID */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user._id);
                        toast.success("User ID copied to clipboard!");
                      }}
                      className="text-gray-600 hover:text-black"
                      title="Copy User ID"
                    >
                      <FiCopy />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update modal */}
      {/* {editingEditor && (
        <UpdateUserModal
          user={editingEditor}
          onClose={() => setEditingEditor(null)}
          onUpdate={fetchEditors}
        />
      )} */}
    </div>
  );
}

export default AllUsers;

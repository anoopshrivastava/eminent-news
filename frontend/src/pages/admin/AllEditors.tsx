import { useEffect, useState } from "react";
import { FiLoader, FiTrash2, FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchInput from "../../components/SearchInput";
import useDebounce from "@/lib/useDebounce";
import api from "@/lib/axios";
import SocialLinkCell from "./SocialLinkCell";

// ---------- TYPES ----------
export interface Editor {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  followers: string[];
  following: string[];
  createdAt: string;
  linkedInLink?: string;
  twitterLink?: string;
  youtubeLink?: string;
  verified: boolean;
}

interface FetchEditorsResponse {
  success: boolean;
  users: Editor[];
}

function AllEditors() {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search, 500);

  // ---------- FETCH EDITORS ----------
  const fetchEditors = async () => {
    setLoading(true);
    try {
      const response = await api.get<FetchEditorsResponse>(
        `/admin/editors?searchKey=${search}`
      );

      if (response.data?.success) {
        setEditors(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching editors:", error);
      toast.error("Error fetching editors. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- DELETE EDITOR ----------
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this editor?")) return;

    setDeleting(id);
    try {
      const response = await api.delete(`/admin/user/${id}`);

      if (response.data?.success) {
        setEditors((prev) => prev.filter((editor) => editor._id !== id));
        toast.success("Editor deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting editor:", error);
      toast.error("Error deleting editor. Try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await api.put(`/admin/user/${id}`, {
        verified: !currentStatus,
      });

      if (res.data?.success) {
        setEditors((prev) =>
          prev.map((editor) =>
            editor._id === id ? { ...editor, verified: !currentStatus } : editor
          )
        );
        toast.success("Status updated successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchEditors();
  }, [debouncedSearch]);

  return (
    <div className="flex-1 flex-col min-h-screen">
      <div className="flex items-center gap-3 mb-4 mt-2">
        <div className="flex items-center justify-between pr-10">
          <h1 className="text-3xl font-bold text-black">All Editors</h1>
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
      ) : editors.length === 0 ? (
        <p className="text-center text-gray-500">No Editor Found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#f40607] text-white">
              <tr>
                <th className="py-3 px-2 text-left">Name</th>
                <th className="py-3 px-2 text-left">Username</th>
                <th className="py-3 px-2 text-left">Email</th>
                <th className="py-3 px-2 text-left">Phone</th>
                <th className="py-3 px-2 text-left">Following</th>
                <th className="py-3 px-2 text-left">Followers</th>
                <th className="py-3 px-2 text-left">LinkedIn</th>
                <th className="py-3 px-2 text-left">Twitter</th>
                <th className="py-3 px-2 text-left">Youtube</th>
                <th className="py-3 px-2 text-left">Status</th>
                <th className="py-3 px-2 text-left">Joined On</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {editors.map((editor) => (
                <tr key={editor._id} className="border-b hover:bg-blue-50">
                  <td className="py-3 px-2">{editor.name}</td>
                  <td className="py-3 px-2">{editor.username}</td>
                  <td className="py-3 px-2">{editor.email}</td>
                  <td className="py-3 px-2">{editor.phone}</td>

                  <td className="py-3 px-2">{editor.following.length}</td>
                  <td className="py-3 px-2">{editor.followers.length}</td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    <SocialLinkCell url={editor.linkedInLink} />
                  </td>

                  <td className="py-3 px-2 hidden md:table-cell">
                    <SocialLinkCell url={editor.twitterLink} />
                  </td>

                  <td className="py-3 px-2 hidden md:table-cell">
                    <SocialLinkCell url={editor.youtubeLink} />
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      {/* Badge */}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          editor.verified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {editor.verified ? "Approved" : "Pending"}
                      </span>

                      {/* Toggle */}
                      <button
                        onClick={() =>
                          handleStatusToggle(editor._id, editor.verified)
                        }
                        className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
                          editor.verified ? "bg-green-500" : "bg-gray-300"
                        }`}
                        title="Toggle Status"
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                            editor.verified ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-2">
                    {editor.createdAt.split("T")[0]}
                  </td>

                  <td className="py-3 px-2 text-center flex justify-center gap-4">
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(editor._id)}
                      className="text-[#f40607] hover:text-red-700"
                      disabled={deleting === editor._id}
                      title="Delete Editor"
                    >
                      {deleting === editor._id ? (
                        <FiLoader className="animate-spin text-[#f40607]" />
                      ) : (
                        <FiTrash2 />
                      )}
                    </button>

                    {/* Copy ID */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(editor._id);
                        toast.success("Editor ID copied to clipboard!");
                      }}
                      className="text-gray-600 hover:text-black"
                      title="Copy Editor ID"
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
    </div>
  );
}

export default AllEditors;

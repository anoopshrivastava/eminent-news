import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiTrash2, FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchInput from "../../components/SearchInput";
import useDebounce from "@/lib/useDebounce";
// import UpdateUserModal from "./UpdateUserModal"; // ensure correct import

// ---------- TYPES ----------
interface EditorInfo {
  storeName: string;
  businessType: string;
  gstNumber: string;
  storeAddress: string;
}

export interface Editor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  editorInfo: EditorInfo;
  createdAt: string;
}

interface FetchEditorsResponse {
  success: boolean;
  users: Editor[];
}

function AllEditors() {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  // const [editingEditor, setEditingEditor] = useState<Editor | null>(null);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search, 500);

  // ---------- FETCH EDITORS ----------
  const fetchEditors = async () => {
    setLoading(true);
    try {
      const response = await axios.get<FetchEditorsResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/editors?searchKey=${search}`,
        { withCredentials: true }
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
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/user/${id}`,
        { withCredentials: true }
      );

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

  useEffect(() => {
    fetchEditors();
  }, [debouncedSearch]);

  return (
    <div className="flex-1 flex-col min-h-screen">
      <div className="flex items-center gap-3 mb-4 mt-2">
        <div className="flex items-center justify-between pr-10">
          <h1 className="text-3xl font-bold text-blue-600">All Editors</h1>
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
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="py-3 px-2 text-left">Name</th>
                <th className="py-3 px-2 text-left">Email</th>
                <th className="py-3 px-2 text-left">Phone</th>
                <th className="py-3 px-2 text-left">StoreName</th>
                <th className="py-3 px-2 text-left">BusinessType</th>
                <th className="py-3 px-2 text-left">GstNumber</th>
                <th className="py-3 px-2 text-left">Address</th>
                <th className="py-3 px-2 text-left">Joined On</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {editors.map((editor) => (
                <tr key={editor._id} className="border-b hover:bg-blue-50">
                  <td className="py-3 px-2">{editor.name}</td>
                  <td className="py-3 px-2">{editor.email}</td>
                  <td className="py-3 px-2">{editor.phone}</td>

                  <td className="py-3 px-2">{editor.editorInfo.storeName}</td>
                  <td className="py-3 px-2">{editor.editorInfo.businessType}</td>
                  <td className="py-3 px-2">{editor.editorInfo.gstNumber}</td>
                  <td className="py-3 px-2">{editor.editorInfo.storeAddress}</td>

                  <td className="py-3 px-2">{editor.createdAt.split("T")[0]}</td>

                  <td className="py-3 px-2 text-center flex justify-center gap-4">
                    {/* Edit */}
                    {/* <button
                      onClick={() => setEditingEditor(editor)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Editor"
                    >
                      <FiEdit />
                    </button> */}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(editor._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={deleting === editor._id}
                      title="Delete Editor"
                    >
                      {deleting === editor._id ? (
                        <FiLoader className="animate-spin text-red-500" />
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

export default AllEditors;

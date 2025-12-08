import { useEffect, useState } from "react";
import { type Short } from "@/types/shorts";
import ShortCard from "@/components/ShortCard"
import ShortUploadModal from "@/components/ShortUploadModal";
import api from "@/lib/axios";

export default function ShortsManager() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchShorts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/shorts");
      setShorts(res.data.shorts ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to load shorts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this short? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/shorts/${id}`);
      setShorts((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Shorts</h2>
        <ShortUploadModal onUploaded={fetchShorts} />
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : shorts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No shorts yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shorts.map((short) => (
            <ShortCard
              key={short._id}
              short={short}
              onDelete={handleDelete}
              deleting={deletingId === short._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

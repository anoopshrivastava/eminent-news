import { useEffect, useState } from "react";
import type { Video } from "@/types/video";
import VideoCard from "@/components/VideoCard";
import VideoUploadModal from "@/components/VideoUploadModal"; // similar to ShortUploadModal
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function VideosManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/my-videos");
      setVideos(res.data.videos ?? []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load videos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      await api.delete(`/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      toast.success("Video deleted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">My Videos</h2>
        <VideoUploadModal onUploaded={fetchVideos} />
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : videos.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No videos uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onDelete={handleDelete}
              deleting={deletingId === video._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

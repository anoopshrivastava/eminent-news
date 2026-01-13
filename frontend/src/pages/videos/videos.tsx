import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Video } from "@/types/video";
import api from "@/lib/axios";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state: any) => state.user);

  const navigate = useNavigate();

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/videos");
      setVideos(res.data.videos ?? []);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Loading videos...</span>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-gray-500">No videos available</p>
        <Button onClick={fetchVideos} variant="outline">
          <RefreshCw className="mr-2" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-16 py-6 pb-10 md:pb-6">
      <h1 className="text-2xl font-bold mb-6 md:mt-2">Latest Videos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            currentUserId={currentUser?._id}
            onLike={async (id) => {
              await api.put(`/videos/${id}/like`);
            }}
            onOpen={() =>
              navigate(`/videos/${video._id}`, {
                state: { video },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

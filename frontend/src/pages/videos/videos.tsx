import { useEffect, useRef, useState, useCallback } from "react";
import type { Video } from "@/types/video";
import VideoReelCard from "@/components/VideoReelCard";
import api from "@/lib/axios";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideosReel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/videos");
      setVideos(res.data.videos ?? []);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options: IntersectionObserverInit = {
      root: null,
      threshold: [0.6], // play when 60% visible
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector("video") as HTMLVideoElement | null;
        if (!video) return;

        if (entry.isIntersecting) {
          const videoId = entry.target.getAttribute("data-video-id");
          if (videoId) setActiveVideoId(videoId);

          video.play().catch(() => {});
        } else {
          try {
            video.pause();
          } catch {}
        }
      });
    }, options);

    const items = container.querySelectorAll(".snap-item");
    items.forEach((item) => observerRef.current?.observe(item));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [videos]);

  const handleLike = async (id: string) => {
    try {
      await api.post(`/videos/${id}/like`);
    } catch (err) {
      console.error("like failed", err);
    }
  };

  const handleVideoTap = (id: string) => {
    setActiveVideoId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="md:hidden w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="md:hidden w-full h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gray-900">
        <div className="text-gray-400">No videos yet.</div>
        <Button
          onClick={fetchVideos}
          variant="outline"
          className="text-white border-gray-600"
        >
          <RefreshCw className="mr-2" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-screen bg-gray-900">
      <div
        ref={containerRef}
        className="max-w-md mx-auto w-full h-full overflow-y-auto snap-y snap-mandatory touch-pan-y scrollbar-hide"
      >
        {videos.map((video) => (
          <div
            key={video._id}
            data-video-id={video._id}
            className="snap-item snap-start w-full h-screen bg-gray-900"
          >
            <VideoReelCard
              video={video}
              onLike={handleLike}
              onVideoTap={() => handleVideoTap(video._id)}
              isActive={activeVideoId === video._id}
              onRefresh={fetchVideos}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

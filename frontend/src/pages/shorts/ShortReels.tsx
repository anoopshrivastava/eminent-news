import { useEffect, useRef, useState, useCallback } from "react";
import { type Short } from "@/types/shorts";
import ReelCard from "@/components/ReelCard";
import api from "@/lib/axios";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

export default function ShortsReel() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { currentUser } = useSelector((state: any) => state.user);

  const fetchShorts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/shorts");
      setShorts(res.data.shorts ?? []);
    } catch (err) {
      console.error("Failed to fetch shorts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShorts();
  }, [fetchShorts]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Observe videos inside container
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: [0.55], // play when 55% visible
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector("video") as HTMLVideoElement | null;
        if (!video) return;

        if (entry.isIntersecting) {
          // Set as active video
          const shortId = entry.target.getAttribute("data-short-id");
          if (shortId) {
            setActiveVideoId(shortId);
          }
          
          // try to play
          // video.muted = true;
          video.play().catch(() => {
            // autoplay might be blocked; keep muted
            // video.muted = true;
          });
        } else {
          // pause if not intersecting
          try {
            video.pause();
          } catch (e) {}
        }
      });
    }, options);

    // observe each snap child
    const items = container.querySelectorAll(".snap-item");
    items.forEach((it) => observerRef.current?.observe(it));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [shorts]);

  const handleLike = async (id: string) => {

    try {
      await api.post(`/shorts/${id}/like`);

    } catch (err) {
      console.error("like failed", err);
    }
  };

  const handleVideoTap = (id: string) => {
    setActiveVideoId(prev => prev === id ? null : id);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-lg text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!shorts.length) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gray-900">
        <div className="text-gray-400">No shorts yet.</div>
        <Button onClick={fetchShorts} variant="outline" className="text-white border-gray-600">
          <RefreshCw className="mr-2" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-screen bg-gray-900">

      {/* Reel items */}
      <div 
        className="max-w-md mx-auto w-full h-full overflow-y-auto snap-y snap-mandatory touch-pan-y scrollbar-hide" 
        ref={containerRef}
      >
        {shorts.map((short) => (
          <div 
            key={short._id} 
            data-short-id={short._id}
            className="snap-item snap-start w-full h-screen bg-gray-900"
          >
            <ReelCard 
              short={short} 
              onLike={handleLike}
              onVideoTap={() => handleVideoTap(short._id)}
              isActive={activeVideoId === short._id}
              onRefresh={()=>fetchShorts()}
              currentUser={currentUser}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
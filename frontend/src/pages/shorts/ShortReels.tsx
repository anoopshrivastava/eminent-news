import { useEffect, useRef, useState, useCallback } from "react";
import { type Short } from "@/types/shorts";
import ReelCard from "@/components/ReelCard";
import api from "@/lib/axios";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { Ads } from "@/types/ads";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";

type FeedItem =
  | { type: "short"; data: Short }
  | { type: "fullAd"; data: Ads }
  | { type: "videoAd"; data: Ads };

export default function ShortsReel() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [shortsLoading, setShortsLoading] = useState(false);
  const [adsLoading, setAdsLoading] = useState(false);

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { currentUser } = useSelector((state: any) => state.user);
  const [ads, setAds] = useState<Ads[]>([]);

  const [searchParams] = useSearchParams();
  const shortIdFromQuery = searchParams.get("id");
  const navigate = useNavigate();

  const fetchShorts = useCallback(async () => {
    setShortsLoading(true);
    try {
      const res = await api.get("/shorts");
      setShorts(res.data.shorts ?? []);
    } finally {
      setShortsLoading(false);
    }
  }, []);

  const fetchAds = useCallback(async () => {
    setAdsLoading(true);
    try {
      const res = await api.get("/ads");
      setAds(res.data?.ads ?? []);
    } finally {
      setAdsLoading(false);
    }
  }, []);

  const FullPageShorts = ads.filter((ad) => ad.category === "FullPageShorts");
  const VideoShorts = ads.filter((ad) => ad.category === "Video" && ad.video?.ratio === "9:16");

  const feedItems = useMemo<FeedItem[]>(() => {
    const result: FeedItem[] = [];

    let fullAdIndex = 0;
    let videoAdIndex = 0;

    shorts.forEach((short, index) => {
      // push short
      result.push({ type: "short", data: short });

      // after every 4 shorts
      if ((index + 1) % 4 === 0) {
        // alternate ads
        if (fullAdIndex < FullPageShorts.length) {
          result.push({
            type: "fullAd",
            data: FullPageShorts[fullAdIndex++],
          });
        } else if (videoAdIndex < VideoShorts.length) {
          result.push({
            type: "videoAd",
            data: VideoShorts[videoAdIndex++],
          });
        }
      }
    });

    return result;
  }, [shorts, FullPageShorts, VideoShorts]);

  useEffect(() => {
    fetchShorts();
    fetchAds();
  }, [fetchShorts, fetchAds]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector(
            "video"
          ) as HTMLVideoElement | null;
          if (!video) return;

          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-short-id");
             video.muted = false;
            if (id) setActiveVideoId(id);

            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.55 }
    );

    observerRef.current = observer;

    const items = container.querySelectorAll(".snap-item");
    items.forEach((it) => observer.observe(it));

    return () => observer.disconnect();
  }, [feedItems]);

  const handleLike = async (id: string) => {
    try {
      await api.post(`/shorts/${id}/like`);
    } catch (err) {
      console.error("like failed", err);
    }
  };

  const handleVideoTap = (id: string) => {
    setActiveVideoId((prev) => (prev === id ? null : id));
  };

  // useEffect(() => {
  //   if (!shortIdFromQuery || !containerRef.current) return;

  //   const element = containerRef.current.querySelector(
  //     `[data-short-id="${shortIdFromQuery}"]`
  //   );

  //   if (element) {
  //     element.scrollIntoView({ behavior: "auto" });
  //     navigate("/shorts", { replace: true });
  //   }
  // }, [shortIdFromQuery, feedItems]);

  const hasHandledDeepLink = useRef(false);

  useEffect(() => {
    if (
      !shortIdFromQuery ||
      !containerRef.current ||
      hasHandledDeepLink.current
    )
      return;

    const element = containerRef.current.querySelector(
      `[data-short-id="${shortIdFromQuery}"]`
    );

    if (element) {
      hasHandledDeepLink.current = true;

      // Scroll instantly
      element.scrollIntoView({ behavior: "auto" });

      // Let IntersectionObserver trigger play
      setTimeout(() => {
        navigate("/shorts", { replace: true });
      }, 700);
    }
  }, [shortIdFromQuery, feedItems]);

  const loading = shortsLoading || adsLoading;

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
        <Button
          onClick={fetchShorts}
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
      {/* Reel items */}
      <div
        className="max-w-md mx-auto w-full h-full overflow-y-auto snap-y snap-mandatory touch-pan-y scrollbar-hide"
        ref={containerRef}
      >
        {/* {shorts.map((short) => (
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
              onRefresh={() => fetchShorts()}
              currentUser={currentUser}
            />
          </div>
        ))} */}

        {feedItems.map((item, index) => {
          if (item.type === "short") {
            const short = item.data;

            return (
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
                  onRefresh={() => fetchShorts()}
                  currentUser={currentUser}
                />
              </div>
            );
          }

          if (item.type === "fullAd") {
            const img = item.data.images as string[];

            return (
              <div
                key={`full-ad-${item.data._id}-${index}`}
                data-ad="true"
                className="snap-item snap-start relative w-full h-screen bg-black"
              >
                <AdLabel />
                <img src={img[0]} className="w-full h-full object-cover" />
              </div>
            );
          }


          if (item.type === "videoAd") {
            return (
              <div
                key={`video-ad-${item.data._id}-${index}`}
                className="snap-item snap-start w-full h-screen bg-black"
              >
                {/* Your Video Ad Component */}
                <video
                  src={item.data.video?.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

const AdLabel = () => (
  <div className="absolute top-4 left-4 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded">
    Ad
  </div>
);

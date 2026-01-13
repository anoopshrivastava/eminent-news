import { useRef, useState } from "react";
import type { Video } from "@/types/video";
import { Heart, Share2, Play } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  video: Video;
  onLike?: (id: string) => Promise<void>;
  onOpen?: () => void;
  currentUserId?: string;
};

const formatDuration = (seconds: number) => {
  if (!seconds && seconds !== 0) return "";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function VideoCard({
  video,
  onLike,
  onOpen,
  currentUserId,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [liked, setLiked] = useState(() => {
    if (!currentUserId || !Array.isArray(video.likes)) return false;

    return video.likes.some((l) => String(l.user) === String(currentUserId));
  });

  const [likesCount, setLikesCount] = useState(
    Array.isArray(video.likes) ? video.likes.length : 0
  );

  //   const [playing, setPlaying] = useState(false);

  //   const togglePlay = () => {
  //     const vid = videoRef.current;
  //     if (!vid) return;

  //     if (vid.paused) {
  //       vid.play();
  //       setPlaying(true);
  //     } else {
  //       vid.pause();
  //       setPlaying(false);
  //     }
  //   };

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Please Login First !!");
      return;
    }

    const willLike = !liked;

    // optimistic update
    setLiked(willLike);
    setLikesCount((prev) => (willLike ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await onLike?.(video._id);
    } catch {
      // rollback on failure
      setLiked(!willLike);
      setLikesCount((prev) => (willLike ? Math.max(0, prev - 1) : prev + 1));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/videos/${video._id}`
      );
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      {/* Video */}

      <div
        className="relative aspect-video bg-black cursor-pointer"
        onClick={onOpen}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          preload="metadata"
        />

        {/* Play overlay */}
        {/* {!playing && ( */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Play size={42} className="text-white" />
        </div>
        {/* )} */}

        {/* Duration badge */}
        {typeof video.duration === "number" && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-md font-medium">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 md:line-clamp-1">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-xs text-gray-500 line-clamp-2 md:line-clamp-1 mt-1">
            {video.description}
          </p>
        )}

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-400">
            {typeof video.editor !== "string" && video.editor?.name}
          </span>

          <div className="flex gap-3">
            <button onClick={handleLike} className="flex items-center gap-1">
              <Heart
                size={18}
                className={liked ? "text-red-500" : "text-gray-500"}
                fill={liked ? "currentColor" : "none"}
              />
              <span className="text-xs text-gray-500">{likesCount}</span>
            </button>

            <button onClick={handleShare}>
              <Share2 size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

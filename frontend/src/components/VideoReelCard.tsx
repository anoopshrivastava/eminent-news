import { useEffect, useRef, useState } from "react";
import type { Video } from "@/types/video";
import {
  Heart,
  Share2,
  Pause,
  Play,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type Props = {
  video: Video;
  onLike?: (id: string) => Promise<void>;
  onVideoTap?: () => void;
  isActive?: boolean;
  onRefresh?: () => void;
};

export default function VideoReelCard({
  video,
  onLike,
  onVideoTap,
  isActive,
  onRefresh,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [processingLike, setProcessingLike] = useState(false);

  /* sync play/pause state */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    vid.addEventListener("play", onPlay);
    vid.addEventListener("pause", onPause);

    return () => {
      vid.removeEventListener("play", onPlay);
      vid.removeEventListener("pause", onPause);
    };
  }, []);

  /* intersection control */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || isActive === undefined) return;

    if (isActive) {
      vid.muted = muted;
      vid.play().catch(() => {
        vid.muted = true;
        vid.play().catch(() => {});
      });
    } else {
      vid.pause();
    }
  }, [isActive, muted]);

  const handleVideoTapLocal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.muted = muted;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }

    setShowPlayButton(true);
    setTimeout(() => setShowPlayButton(false), 300);
    onVideoTap?.();
  };

  const togglePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    vid.paused ? vid.play().catch(() => {}) : vid.pause();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMuted((m) => !m);
  };

  const handleRefresh = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    vid.currentTime = 0;
    if (!vid.paused) vid.play().catch(() => {});
    onRefresh?.();
  };

  const handleLikeLocal = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (processingLike) return;

    setProcessingLike(true);
    const prev = liked;
    setLiked(!liked);

    try {
      if (onLike) await onLike(video._id);
    } catch {
      setLiked(prev);
    } finally {
      setProcessingLike(false);
    }
  };

  const handleShare = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
        const url = `${window.location.origin}/videos`;
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    } catch (err) {
        toast.error("Failed to copy link");
    }
    };


  return (
    <div className="w-full h-full snap-center relative bg-gray-900 flex items-center justify-center">
      <div
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleVideoTapLocal}
      >
        {/* Video */}
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-contain -mt-20"
            playsInline
            muted={muted}
            controls={false}
            preload="auto"
          />
        </div>

        {/* Tap feedback */}
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center">
              {isPlaying ? (
                <Pause size={32} className="text-white" />
              ) : (
                <Play size={32} className="text-white ml-1" />
              )}
            </div>
          </div>
        )}

        {/* Top-right controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRefresh}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border border-white "
          >
            <RefreshCw size={18} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border border-white "
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border border-white "
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
        </div>

        {/* Info */}
        <div className="absolute left-4 bottom-28 text-white max-w-[75%]">
          <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
          {video.description && (
            <p className="text-sm opacity-80 line-clamp-2 mt-1">
              {video.description}
            </p>
          )}
          <p className="text-xs opacity-70 mt-2">
            {video.editor &&
              typeof video.editor !== "string" &&
              video.editor.name}
            {video.createdAt &&
              ` • ${new Date(video.createdAt).toLocaleDateString()}`}
          </p>
        </div>

        {/* Right actions */}
        <div className="absolute right-4 bottom-36 flex flex-col gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLikeLocal}
            disabled={processingLike}
            className={`w-12 h-12 rounded-full border-2 border-white ${
              liked
                ? "bg-red-500 text-white"
                : "bg-black/70 text-white hover:bg-red-500"
            }`}
          >
            <Heart size={22} fill={liked ? "currentColor" : "none"} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border border-white "
          >
            <Share2 size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
}

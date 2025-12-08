import { useEffect, useRef, useState } from "react";
import { type Short } from "@/types/shorts";
import { Heart, Share2, Pause, Play, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  short: Short;
  onLike?: (id: string) => Promise<void>;
  onVideoTap?: () => void;
  isActive?: boolean;
  onRefresh?: () => void;
};

export default function ReelCard({ short, onLike, onVideoTap, isActive, onRefresh }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(true);
  const [processingLike, setProcessingLike] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = muted;
    vid.playsInline = true;
    vid.preload = "auto";

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    vid.addEventListener("play", handlePlay);
    vid.addEventListener("pause", handlePause);

    return () => {
      vid.removeEventListener("play", handlePlay);
      vid.removeEventListener("pause", handlePause);
    };
  }, [muted]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive === undefined) return;

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
      vid.play().catch(() => {
        vid.muted = true;
        vid.play().catch(() => {});
      });
    } else {
      vid.pause();
    }

    // Show visual feedback for tap
    setShowPlayButton(true);
    setTimeout(() => setShowPlayButton(false), 300);

    onVideoTap?.();
  };

  const togglePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.muted = muted;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMuted(!muted);
  };

  const handleRefresh = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      if (!vid.paused) {
        vid.play().catch(() => {});
      }
    }
    onRefresh?.();
  };

  const handleLikeLocal = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (processingLike) return;
    setProcessingLike(true);
    const previous = liked;
    setLiked(!liked);

    try {
      if (onLike) await onLike(short._id);
    } catch (err) {
      console.error("like API failed", err);
      setLiked(previous);
    } finally {
      setProcessingLike(false);
    }
  };

  return (
    <div className="w-full h-full snap-center relative bg-gray-900 flex items-center justify-center">
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleVideoTapLocal}
      >
        {/* Video container with proper aspect ratio */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={short.videoUrl}
            className="w-full h-full object-contain"
            loop
            playsInline
            muted={muted}
            controls={false}
            autoPlay
          />
        </div>

        {/* Transient play/pause indicator (center) - only shows briefly on tap */}
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
              {isPlaying ? (
                <Pause size={32} className="text-white" />
              ) : (
                <Play size={32} className="text-white ml-1" />
              )}
            </div>
          </div>
        )}

        {/* Persistent control buttons (top-right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-3 pointer-events-auto">
          {/* Play/Pause button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black/90 shadow-lg border border-white "
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>

          {/* Refresh/Replay button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black/90 shadow-lg border border-white "
            aria-label="Replay"
          >
            <RefreshCw size={18} />
          </Button>

          {/* Mute/Unmute button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black/90 shadow-lg border border-white "
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
        </div>

        {/* Content info (bottom-left) */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 pb-32 pointer-events-none">
          <div className="mb-4 pointer-events-auto max-w-[75%]">
            <h3 className="text-white text-lg font-semibold line-clamp-2 drop-shadow-lg">
              {short.title}
            </h3>
            {short.description && (
              <p className="text-sm text-gray-200 mt-1 line-clamp-2 drop-shadow">
                {short.description}
              </p>
            )}
            <p className="text-xs text-gray-300 mt-2 drop-shadow">
              {short.editor && typeof short.editor !== "string" ? short.editor.name ?? "" : ""}
              {short.createdAt && ` • ${new Date(short.createdAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        {/* Action buttons (right side) */}
        <div className="absolute right-4 bottom-36 flex flex-col items-center gap-4 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLikeLocal}
            disabled={processingLike}
            aria-label="Like"
            className={`w-12 h-12 rounded-full shadow-lg border-2 border-white ${
              liked 
                ? "bg-red-500/90 text-white hover:bg-red-600/90" 
                : "bg-black/70 text-white hover:bg-black/90"
            }`}
          >
            <Heart 
              size={22} 
              fill={liked ? "currentColor" : "none"} 
              strokeWidth={liked ? 1.5 : 2}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/70 text-white hover:bg-black/90 shadow-lg border-2 border-white "
            aria-label="Share"
          >
            <Share2 size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
}
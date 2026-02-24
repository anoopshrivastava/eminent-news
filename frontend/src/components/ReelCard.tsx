import { useEffect, useRef, useState } from "react";
import { type Short } from "@/types/shorts";
import { Heart, Share2, Pause, Play, RefreshCw, Volume2, VolumeX, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Avatar, AvatarFallback } from "./ui/avatar";


type Props = {
  short: Short;
  onLike?: (id: string) => Promise<void>;
  onVideoTap?: () => void;
  isActive?: boolean;
  onRefresh?: () => void;
  currentUser?: any;
};

export default function ReelCard({
  short,
  onLike,
  onVideoTap,
  isActive,
  onRefresh,
  currentUser,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [processingLike, setProcessingLike] = useState(false);

  // Comments state
  const [comments, setComments] = useState<any[]>(short.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

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

  // keep local comments in sync when parent short changes
  useEffect(() => {
    setComments(short.comments || []);
  }, [short.comments]);

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
    setMuted((m) => !m);
    const vid = videoRef.current;
    if (vid) {
      vid.muted = !muted;
    }
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

  const handleShare = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      const url = `${window.location.origin}/shorts?id=${short._id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // --------------- Comments handlers (based on your demo) ----------------
  const handleAddComment = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentUser) {
      toast.error("Please Login First !!");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setCommentLoading(true);

      const { data } = await api.post(`/shorts/${short._id}/comment`, {
        comment: commentText,
      });

      // update UI instantly
      setComments((prev) => [...(prev || []), data.comment]);
      setCommentText("");
      toast.success("Comment added Successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentUser) {
      toast.error("Please Login First !!");
      return;
    }

    try {
      setDeleteLoading(commentId);

      await api.delete(`/shorts/${short._id}/comment/${commentId}`);

      setComments((prev: any[]) => prev.filter((c) => c._id !== commentId));

      toast.success("Comment deleted Successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeleteLoading(null);
    }
  };

  // -----------------------------------------------------------------------

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
            className="w-full h-full object-contain -mt-24"
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
        <div className="absolute top-10 right-4 z-20 flex flex-col items-center gap-3 pointer-events-auto">
          {/* Refresh/Replay button */}
          <Button
            title="Refresh"
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border border-white "
            aria-label="Replay"
          >
            <RefreshCw size={18} />
          </Button>

          {/* Play/Pause button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border border-white "
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>

          {/* Mute/Unmute button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border border-white "
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
        </div>

        {/* Content info (bottom-left) */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 pb-40 md:pb-20 pointer-events-none">
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
        <div className="absolute right-4 bottom-48 md:bottom-20 flex flex-col items-center gap-4 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLikeLocal}
            disabled={processingLike}
            aria-label="Like"
            className={`w-12 h-12 rounded-full shadow-lg border-2 border-white ${
              liked ? "bg-red-500/90 text-white hover:bg-red-600/90" : "bg-black/70 text-white hover:bg-red-500"
            }`}
          >
            <Heart size={22} fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 1.5 : 2} />
          </Button>

          {/* Comments button */}
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
            size="icon"
            className="w-12 h-12 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border-2 border-white "
            aria-label="Comments"
          >
            <MessageCircle size={22} />
          </Button>

          <Button
            variant="ghost"
            onClick={handleShare}
            size="icon"
            className="w-12 h-12 rounded-full bg-black/70 text-white hover:bg-white hover:text-black shadow-lg border-2 border-white "
            aria-label="Share"
          >
            <Share2 size={22} />
          </Button>

          
        </div>
      </div>

      {/* -------------- Comments Drawer / Overlay -------------- */}
    <div
      className={`max-w-md mx-auto fixed inset-0 z-40 transition-opacity duration-300 ${
        showComments ? "bg-black/60 opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={() => setShowComments(false)}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl
        max-h-[80vh] w-full transform transition-transform duration-300
        ${showComments ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-6 overflow-y-auto max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-sm text-gray-500"
            >
              Close
            </button>
          </div>

          {/* Add Comment */}
          <div className="mt-2 space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#f40607]"
              rows={3}
            />

            <div className="flex items-center gap-3">
              <Button
                onClick={handleAddComment}
                disabled={commentLoading}
                className="bg-[#f40607] hover:bg-red-600"
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </Button>

              <Button variant="ghost" onClick={() => setCommentText("")}>
                Clear
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="mt-4 space-y-4 pb-16 md:pb-6">
            {comments && comments.length > 0 ? (
              comments.map((c: any) => (
                <div key={c._id} className="flex gap-3 p-3 border rounded-md">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {c.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {c.user?.name || "User"}{" "}
                        {currentUser?._id === c.user?._id && (
                          <span className="text-xs text-gray-500">(You)</span>
                        )}
                      </p>

                      {currentUser?._id === c.user?._id && (
                        <button
                          onClick={(e) => handleDeleteComment(c._id, e)}
                          disabled={deleteLoading === c._id}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1"
                        >
                          {deleteLoading === c._id ? "Deleting..." : <Trash2 size={13} />}
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-gray-700">{c.comment}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 pb-16 md:pb-6">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

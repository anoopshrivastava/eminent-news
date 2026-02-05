import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2, Trash2 } from "lucide-react";
import type { Video } from "@/types/video";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import profile from "@/assets/profile.webp";
import api from "@/lib/axios";
import type { Ads } from "@/types/ads";

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useSelector((state: any) => state.user);

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [videoAd, setVideoAd] = useState<Ads | null>(null);

  /* Fetch video */
  const fetchVideo = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/videos/${id}`);
      setVideo(data.video);
    } catch (err) {
      toast.error("Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoAd = async () => {
    try {
      const { data } = await api.get(`/ads/video/${id}`);
      setVideoAd(data.ad);
    } catch {
      console.error("Failed to load ad");
    }
  };

  useEffect(() => {
    fetchVideoAd();
    fetchVideo();
  }, [id]);

  /* Initialize like state from backend data */
  useEffect(() => {
    if (!video) return;

    setLikesCount(video.likes?.length || 0);

    if (currentUser && Array.isArray(video.likes)) {
      const isLiked = video.likes.some(
        (l: any) => String(l.user) === String(currentUser._id)
      );
      setLiked(isLiked);
    }
  }, [video, currentUser]);

  /* Like */
  const handleLike = async () => {
    if (loadingLike) return;

    if (!currentUser) {
      toast.error("Please Login First !!");
      return;
    }

    const willLike = !liked;
    setLoadingLike(true);

    // optimistic update
    setLiked(willLike);
    setLikesCount((prev) => (willLike ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await api.put(`/videos/${video?._id}/like`);
      if (res?.data?.likesCount !== undefined) {
        setLikesCount(res.data.likesCount);
      }
    } catch {
      // rollback
      setLiked(!willLike);
      setLikesCount((prev) => (willLike ? Math.max(0, prev - 1) : prev + 1));
      toast.error("Failed to toggle like");
    } finally {
      setLoadingLike(false);
    }
  };

  /* Share */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/videos/${video?._id}`
      );
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleAddComment = async () => {
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

      const { data } = await api.post(`/videos/${video?._id}/comment`, {
        comment: commentText,
      });

      // update UI instantly
      setVideo((prev: any) => ({
        ...prev,
        comments: [...(prev?.comments || []), data.comment],
      }));

      setCommentText("");
      toast.success("Comment added Successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeleteLoading(commentId);

      await api.delete(`/videos/${video?._id}/comment/${commentId}`);

      setVideo((prev: any) => ({
        ...prev,
        comments: prev.comments.filter((c: any) => c._id !== commentId),
      }));

      toast.success("Comment deleted Successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeleteLoading(null);
    }
  };

  /* Loading / Error */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading video...
      </div>
    );
  }

  if (!video) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Video not found
      </div>
    );
  }

  const editorId = typeof video.editor === "string" ? video.editor : video.editor?._id;

  return (
    <div className="max-w-6xl mx-auto md:px-4 pt-6">
      {/* Back */}
      <button
        className="hidden md:flex items-center gap-2 mx-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="w-6" /> Back
      </button>

      <div className="px-4 pb-6 md:p-6 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-1">{video.title}</h1>
          <Badge className="bg-[#f40607]">Video</Badge>
        </div>

        {/* Video */}
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
          <video
            src={video.videoUrl}
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        {/* Editor */}
        <Link to={`/profile/${editorId}`} className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={
                typeof video.editor !== "string"
                  ? video.editor?.avatar
                  : profile
              }
            />
            <AvatarFallback>
              {typeof video.editor !== "string"
                ? video.editor?.name?.charAt(0)
                : "E"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold">
              {typeof video.editor !== "string" ? video.editor?.name : "Editor"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>

        {/* Description */}
        {video.description && (
          <p className="text-gray-700 text-sm leading-relaxed">
            {video.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleLike}
            disabled={loadingLike}
            className="flex items-center gap-2"
          >
            <Heart
              size={18}
              className={liked ? "fill-red-500 text-[#f40607]" : ""}
            />
            {likesCount} Likes
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 size={16} /> Share
          </Button>
        </div>

        {/* Add Comment */}
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold">Comments</h3>

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#f40607] bg-white"
            rows={3}
          />

          <Button
            onClick={handleAddComment}
            disabled={commentLoading}
            className="bg-[#f40607] hover:bg-red-600"
          >
            {commentLoading ? "Posting..." : "Post Comment"}
          </Button>
        </div>

        {/* Comments List */}
        <div className="mt-4 space-y-4">
          {video.comments && video.comments.length > 0 ? (
            video.comments.map((c: any) => (
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
                      {currentUser?._id === c.user?._id && <span>(You)</span>}
                    </p>

                    {/* Delete only own comment */}
                    {currentUser?._id === c.user?._id && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                        disabled={deleteLoading === c._id}
                      >
                        {deleteLoading === c._id ? "Deleting..." : ""}
                        <Trash2 size={13} />
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
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>

        {videoAd && (
          <div className="w-full space-y-1">
            {/* Ads label */}
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Sponsored
            </span>

            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black relative">
              <video
                src={videoAd.video?.url}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => {
                  if (videoAd.url) {
                    window.open(videoAd.url, "_blank");
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

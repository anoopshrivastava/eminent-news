import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import type { Video } from "@/types/video";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import profile from "@/assets/profile.webp";
import api from "@/lib/axios";

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useSelector((state: any) => state.user);

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

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

  useEffect(() => {
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
    setLikesCount((prev) =>
      willLike ? prev + 1 : Math.max(0, prev - 1)
    );

    try {
      const res = await api.put(`/videos/${video?._id}/like`);
      if (res?.data?.likesCount !== undefined) {
        setLikesCount(res.data.likesCount);
      }
    } catch {
      // rollback
      setLiked(!willLike);
      setLikesCount((prev) =>
        willLike ? Math.max(0, prev - 1) : prev + 1
      );
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
          <h1 className="text-2xl md:text-4xl font-bold mb-1">
            {video.title}
          </h1>
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
        <div className="flex items-center gap-4">
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
              {typeof video.editor !== "string"
                ? video.editor?.name
                : "Editor"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

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
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Share2, ArrowLeft, Heart, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import type { News } from "@/types/news";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import profile from "@/assets/profile.webp"
import { ImageSwiper } from "./ImageSwiper";


export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state: any) => state.user);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);



  const fetchNewsDetail = async () => {
    try {
      const {data} = await api.get(`news/${id}`);
      setNews(data.news);
    } catch (error) {
      console.log("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (loadingLike) return;

    if (!currentUser) {
      toast.error("Please Login First !!");
      return;
    }

    setLoadingLike(true);

    const willLike = !liked;

    // optimistic update
    setLiked(willLike);
    setLikesCount((prev) => (willLike ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await api.put(`/news/${news?._id}/like`);

      if (res?.data?.likesCount !== undefined) {
        setLikesCount(res.data.likesCount);
      }

      toast.success(res?.data?.message || (willLike ? "Liked" : "Unliked"));
    } catch (err: any) {
      // rollback
      setLiked(!willLike);
      setLikesCount((prev) =>
        willLike ? Math.max(0, prev - 1) : prev + 1
      );

      toast.error(
        err?.response?.data?.message || "Failed to toggle like"
      );
    } finally {
      setLoadingLike(false);
    }
  };

  const handleShare = async () => {
    try {
      const fullUrl = `${window.location.origin}/news/${news?._id}`;
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
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

      const { data } = await api.post(`/news/${news?._id}/comment`, {
        comment: commentText,
      });

      // update UI instantly
      setNews((prev: any) => ({
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

      await api.delete(`/news/${news?._id}/comment/${commentId}`);

      setNews((prev: any) => ({
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


  useEffect(() => {
    fetchNewsDetail();
  }, []);

  useEffect(() => {
    if (!news || !currentUser) return;

    const myId = currentUser._id;

    const isLiked =
      Array.isArray(news.likes) &&
      news.likes.some((l: any) => String(l.user) === String(myId));

    setLiked(isLiked);
    setLikesCount(news.likes?.length || 0);
  }, [news, currentUser]);


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold">News Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto md:px-4 pt-6">
      
      {/* Back Button */}
      <button
        className="hidden md:flex items-center gap-2 -mb-3 my-2"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="w-8 ml-4" /> Back
      </button>

      <div className="">
        <div className="-mt-2 md:mt-0 p-4 md:p-6 space-y-6">

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold leading-snug">
            #{news.title}
          </h1>

          {/* Category */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Badge className="px-3 py-1 w-fit rounded-full bg-[#f40607] hover:bg-[#f40607]">
              {news.category}
            </Badge>
            {news.subCategories && news.subCategories.length > 0 && news.subCategories.map((item)=>
            <Badge className="px-3 py-1 w-fit rounded-full bg-[#f40607] hover:bg-[#f40607]">{item}</Badge>) }
          </div>

          {/* Image */}
          {/* {news.images?.length > 0 ? (
            <img
              src={news.images[0]}
              alt="News"
              className="w-full rounded-lg object-cover max-h-[400px]"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )} */}

          {news.images && news.images.length > 0 && (
            <ImageSwiper images={news.images} />
          )}

          {/* Editor Info */}
          <div className="flex items-center gap-4 mt-4">
            <Avatar className="h-12 w-12 ">
              <AvatarImage src={news.editor?.avatar || profile } alt={news.editor?.name} className=""/>
              <AvatarFallback className="bg-gray-300">
                {news.editor?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{news.editor?.name}</p>
              <p className="text-sm text-gray-500">@{news.editor?.username}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-sm">
            {news.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleLike}
              disabled={loadingLike}
              className="flex items-center gap-2"
            >
              <Heart
              size={18}
              className={`${
                liked ? "fill-red-500 text-[#f40607]" : ""
              } transition`}
            />
              {likesCount} Likes
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>

          </div>

          {/* Timestamp */}
          <span className="text-sm text-gray-500">
            Published on: {new Date(news.createdAt).toLocaleDateString()}
          </span>

          {news.videoUrl && (
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
              <video
                src={news.videoUrl}
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* External Video URL */}
          {news.videoUrl2 && (
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
              <video
                src={news.videoUrl2}
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          )}


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
            {news.comments && news.comments.length > 0 ? (
              news.comments.map((c: any) => (
                <div
                  key={c._id}
                  className="flex gap-3 p-3 border rounded-md"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {c.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {c.user?.name || "User"} {currentUser?._id === c.user?._id && <span>(You)</span>}
                      </p>

                      {/* Delete only own comment */}
                      {currentUser?._id === c.user?._id && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                          disabled={deleteLoading === c._id}
                        >
                          {deleteLoading === c._id ? "Deleting..." : ""}
                          <Trash2 size={13}/>
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
        </div>
      </div>
    </div>
  );
}

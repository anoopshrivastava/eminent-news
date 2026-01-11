import { useEffect, useState } from "react";
import { Heart, Share2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import type { News } from "@/types/news";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import api from "@/lib/axios";
import { FaCommentDots } from "react-icons/fa6";
import { Badge } from "./ui/badge";
import { ImageCollage } from "./ImageCollage";

const Post3 = ({ news, fetchNews }: { news: News; fetchNews?: () => void }) => {
  const newsId = news._id;
  const editorId = news.editor?._id;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(news.likes.length || 0);
  const [followed, setFollowed] = useState(false);

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const { currentUser } = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const location = useLocation();
  const fullPath = location.pathname + location.search;

  // try to determine current user and initial liked/followed state
  useEffect(() => {
    if (!currentUser) return;

    const myId = currentUser._id;

    // Determine if I already liked this post
    const isLiked =
      Array.isArray(news.likes) &&
      news.likes.some((l: any) => String(l.user) === String(myId));

    // Determine if I already follow this post’s editor
    const isFollowing =
      Array.isArray(news.editor?.followers) &&
      news.editor.followers.some((f: any) => String(f.user) === String(myId));

    setLiked(isLiked);
    setLikesCount(news.likes?.length || 0);
    setFollowed(isFollowing);
  }, [currentUser, news, editorId]);

  const handleLike = async () => {
    if (loadingLike) return;

    if (!currentUser) {
      toast.error("Please Login First !!");
      navigate("/login");
      return;
    }
    setLoadingLike(true);

    // optimistic update
    const willLike = !liked;
    setLiked(willLike);
    setLikesCount((prev) => (willLike ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await api.put(`/news/${newsId}/like`);
      // server may return counts; prefer server data if present
      if (res?.data?.likesCount !== undefined) {
        setLikesCount(res.data.likesCount);
      }
      toast.success(res?.data?.message || (willLike ? "Liked" : "Unliked"));
    } catch (err: any) {
      // rollback on error
      setLiked(!willLike);
      setLikesCount((prev) => (willLike ? Math.max(0, prev - 1) : prev + 1));
      const message = err?.response?.data?.message || "Failed to toggle like";
      toast.error(message);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleFollow = async () => {
    if (loadingFollow) return;

    if (!currentUser) {
      toast.error("Please Login First !!");
      navigate("/login");
      return;
    }

    if (!editorId) {
      toast.error("Editor information unavailable");
      return;
    }

    setLoadingFollow(true);

    // optimistic update
    const willFollow = !followed;

    try {
      const res = await api.put(`/user/${editorId}/follow`);

      toast.success(
        res?.data?.message || (willFollow ? "Following" : "Unfollowed")
      );
      fetchNews?.();
      // setFollowed(willFollow);
    } catch (err: any) {
      // rollback on error
      setFollowed(!willFollow);
      const message = err?.response?.data?.message || "Failed to toggle follow";
      toast.error(message);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(fullPath);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="flex items-start gap-3 bg-white transition-all overflow-hidden w-full border-b pb-3 last:border-none">
      {/* Image */}
      <div className="overflow-hidden mx-2">
      {/* <Link to={`/news/${news._id}`}>
        <img
          src={
            news.images && news.images.length
              ? news.images[0]
              : "/placeholder.png"
          }
          alt={news.title}
          className="h-48 w-80 object-cover transition-transform duration-300 hover:scale-105 rounded-md"
        />
        </Link> */}
        <Link to={`/news/${news._id}`}>
          <ImageCollage images={news.images} title={news.title} />
        </Link>

      </div>

      {/* Content */}
      <div className="relative h-48 flex-1">
        <div >
            <Badge className="px-2 py-0.5 w-fit text-[10px] mr-2 rounded-full bg-[#f40607] hover:bg-[#f40607]">
              {news.category}
            </Badge>
            {news.subCategories && news.subCategories.length > 0 && news.subCategories.map((item)=>
            <Badge className="px-2 py-0.5 w-fit text-[10px] mr-2 rounded-full bg-[#f40607] hover:bg-[#f40607]">{item}</Badge>) }
        </div>
        {/* username + follow */}
        <div className="flex items-center justify-between">
          <div className="text-lg md:text-base text-gray-500">
            <span className="font-medium text-gray-700">
              {news.editor?.name || "Editor"}
            </span>
            <span> @{news.editor?.username}</span>
          </div>

          <button
            onClick={handleFollow}
            disabled={loadingFollow}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition 
            ${
              followed
                ? "bg-[#f40607] border-red-500 text-white"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {loadingFollow ? (
              <BeatLoader size={10} />
            ) : (
              <>
                <UserPlus size={14} />
                {followed ? "Following" : "Follow"}
              </>
            )}
          </button>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-1">
          # {news.title}
        </h3>

        <div className="flex-1">
          <span className="text-sm text-gray-500 ml-1 line-clamp-3">{news.description}</span>
          {/* Read More */}
          <Link
            to={`/news/${news._id}`}
            className="inline-block text-[#f40607] font-medium text-sm hover:underline ml-1"
          >
            Read more →
          </Link>
        </div>

        <div className="absolute bottom-0 w-full flex justify-between items-center pb-1">
          <p className="text-sm text-gray-500 mt-1">
            By {news.editor?.name} / {news.createdAt.split("T")[0]}
          </p>
          <div className="flex gap-5 items-center">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-[#f40607] transition"
            >
              <Heart
                size={18}
                className={`${
                  liked ? "fill-red-500 text-[#f40607]" : ""
                } transition`}
              />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>

            <button className="flex items-center gap-1 text-sm">
              <FaCommentDots size={18} />{news.comments.length}
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-500 transition"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post3;

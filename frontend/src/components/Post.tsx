import { useEffect, useState } from "react";
import { Heart, Share2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import type { News } from "@/types/news";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const Post = ({ news, fetchNews }: { news: News, fetchNews?:()=>void }) => {
  const newsId = news._id
  const editorId = news.editor?._id

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>((news.likes.length) || 0);
  const [followed, setFollowed] = useState(false);

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const {currentUser} = useSelector((state:any)=>state.user);
  const navigate = useNavigate();

  // try to determine current user and initial liked/followed state
  useEffect(() => {
    if (!currentUser) return;
  
    const myId = currentUser._id;
  
    // Determine if I already liked this post
    const isLiked = Array.isArray(news.likes) && news.likes.some((l: any) =>  String(l.user) === String(myId));
  
    // Determine if I already follow this post’s editor
    const isFollowing = Array.isArray(news.editor?.followers) && news.editor.followers.some((f: any) => String(f.user) === String(myId));

  
    setLiked(isLiked);
    setLikesCount(news.likes?.length || 0);
    setFollowed(isFollowing);
  }, [currentUser, news, editorId]);
  

  const handleLike = async () => {
    if (loadingLike) return;

    if(!currentUser){
      toast.error("Please Login First !!")
      navigate('/login');
      return;
    }
    setLoadingLike(true);

    // optimistic update
    const willLike = !liked;
    setLiked(willLike);
    setLikesCount((prev) => (willLike ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/news/${newsId}/like`,
        {},
        { withCredentials: true }
      );
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

    if(!currentUser){
      toast.error("Please Login First !!")
      navigate('/login');
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
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/${editorId}/follow`,
        {},
        { withCredentials: true }
      );
      toast.success(res?.data?.message || (willFollow ? "Following" : "Unfollowed"));
      fetchNews?.()
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
      await navigator.clipboard.writeText(news.url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={news.images && news.images.length ? news.images[0] : "/placeholder.png"}
          alt={news.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="px-3 pb-3 pt-1">
        {/* Title */}
        <h2 className="text-lg md:text-base font-semibold line-clamp-2 text-gray-900 leading-[1.1] mb-2 md:mb-1.5">
          {news.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm md:text-xs line-clamp-2 leading-[1.1]">
          {news.description}
        </p>

        {/* Author + Follow */}
        <div className="flex items-center justify-between pt-2 md:pt-1.5">
          <div className="text-xs text-gray-500">
            By{" "}
            <span className="font-medium text-gray-700">{news.editor?.name || "Editor"}</span>
          </div>

          <button
            onClick={handleFollow}
            disabled={loadingFollow}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition 
              ${
                followed
                  ? "bg-red-500 border-red-500 text-white"
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

        {/* Like + Share */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-5 items-center">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-500 transition"
            >
              <Heart
                size={18}
                className={`${liked ? "fill-red-500 text-red-500" : ""} transition`}
              />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-500 transition"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>

          {/* Read More */}
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-red-500 font-medium text-sm hover:underline pt-1"
          >
            Read more →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Post;

import { useState } from "react";
import type { NewsPost } from "@/pages/home/HomePage";
import { Heart, Share2, UserPlus } from "lucide-react";

const Post = ({ news }: { news: NewsPost }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(news.likes);
  const [followed, setFollowed] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(news.url);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="px-3 pb-3 pt-1">
        {/* Title */}
        <h2 className="text-lg font-semibold line-clamp-2 text-gray-900 leading-[1.1] mb-1.5">
          {news.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-[1.1]">{news.description}</p>

        {/* Author + Follow */}
        <div className="flex items-center justify-between pt-1.5">
          <div className="text-xs text-gray-500">
            By{" "}
            <span className="font-medium text-gray-700">{news.author}</span>{" "}
            {/* • {news.date} */}
          </div>

          <button
            onClick={() => setFollowed(!followed)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition 
              ${
                followed
                  ? "bg-red-500 border-red-500 text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
          >
            <UserPlus size={14} />
            {followed ? "Following" : "Follow"}
          </button>
        </div>

        {/* Like + Share */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-5">

          
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-500 transition"
          >
            <Heart
              size={18}
              className={`${liked ? "fill-red-500 text-red-500" : ""} transition`}
            />
            {likes > 0 && <span>{likes}</span>}
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

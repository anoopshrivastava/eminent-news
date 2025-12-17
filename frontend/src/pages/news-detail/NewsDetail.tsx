import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Share2, ArrowLeft } from "lucide-react";
import { FaRegHeart } from "react-icons/fa";
import api from "@/lib/axios";
import type { News } from "@/types/news";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchNewsDetail();
  }, []);

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
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-6" /> Back
      </Button>

      <div className="">
        <div className="p-6 space-y-6">

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            #{news.title}
          </h1>

          {/* Category */}
          {news.category && (
            <Badge className="w-fit px-3 py-1 rounded-full bg-red-500">
              {news.category}
            </Badge>
          )}

          {/* Image */}
          {news.images?.length > 0 ? (
            <img
              src={news.images[0]}
              alt="News"
              className="w-full rounded-lg object-cover max-h-[400px]"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}

          {/* Editor Info */}
          <div className="flex items-center gap-4 mt-4">
            <Avatar className="h-12 w-12 ">
              <AvatarImage src="" alt={news.editor?.name} className=""/>
              <AvatarFallback className="bg-gray-300">
                {news.editor?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{news.editor?.name}</p>
              <p className="text-sm text-gray-500">@{news.editor?.name?.split(" ").join("").toLowerCase()}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-lg">
            {news.description}
          </p>

          {/* External link */}
          {news.url && (
            <a
              href={news.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Read full article →
            </a>
          )}

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <Button className="flex items-center gap-2">
              <FaRegHeart /> {news.likes?.length} Likes
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>

          {/* Timestamp */}
          <p className="text-sm text-gray-500 mt-4">
            Published on: {new Date(news.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

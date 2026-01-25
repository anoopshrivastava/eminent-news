import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import EditNewsModal from "./EditNewsModal";
import type { News } from "@/types/news";
import api from "@/lib/axios";
import { ImageCollage } from "../ImageCollage";
import { Link } from "react-router-dom";
import { Switch } from "../ui/switch";

interface NewsCardProps {
  news: News;
  setNews?: React.Dispatch<React.SetStateAction<News[]>>;
  isAdmin : boolean
}

const NewsCard: React.FC<NewsCardProps> = ({ news, setNews, isAdmin }) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;

    try {
      const response = await api.delete(`/news/${news._id}`);
      const resData = response?.data ?? {};

      if (resData.success === true) {
        if (setNews) {
          setNews((prev) => prev.filter((n) => n._id !== news._id));
        }
        toast.success("News Deleted Successfully");
      } else {
        toast.error(resData.message ?? "Failed to delete news");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error Deleting News");
    }
  };

  const handleToggleApprove = async () => {
    try {
      const res = await api.put(`/news/${news._id}/approve`);

      if (res.data.success && setNews) {
        setNews((prev) =>
          prev.map((a) =>
            a._id === news._id ? { ...a, isApproved: res.data.isApproved } : a
          )
        );
      }

      toast.success(res.data.isApproved ? "News Approved" : "News Unapproved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update approval status");
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-80 md:w-72 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 mx-2">
    
    <Link to={`/news/${news._id}`} className="block h-full">
      <ImageCollage images={news.images} title={news.title} />

      {/* Gradient overlay (non-interactive) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </Link>

    {/* ✅ Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 left-3 z-40 bg-white/90 backdrop-blur p-2 rounded-full
          text-rose-600 hover:bg-rose-600 hover:text-white transition shadow-md"
        title="Delete"
      >
        <FiTrash size={14} />
      </button>
      {isAdmin && (
              <button
                onClick={handleToggleApprove}
                className={`absolute top-3 right-3 z-40 flex items-center justify-center`}
                title={news.isApproved ? "Unapprove News" : "Approve News"}
              >
                  <Switch
                    checked={news.isApproved}
                    onCheckedChange={handleToggleApprove}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-400"
                  />
              </button>
            )}
    </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-3 space-y-1.5">
          <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-1">
            {news.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-1">
            {news.description}
          </p>

          <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
            <span>
              Editor:{" "}
              <span className="font-medium text-gray-700">
                {news.editor?.name ?? "Unknown"}
              </span>
            </span>
            <span className="font-medium text-white bg-red-500 px-2 py-1 rounded-full">
              {news.category ?? "Other"}
            </span>
          </div>

          {/* Subcategories */}
          {news.subCategories?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {news.subCategories.map((cat) => (
                <span
                  key={cat}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditOpen && (
        <EditNewsModal
          news={news}
          onClose={() => setIsEditOpen(false)}
          setNews={setNews}
        />
      )}
    </>
  );
};

export default NewsCard;

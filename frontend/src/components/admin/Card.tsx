import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import EditNewsModal from "./EditNewsModal";
import type { News } from "@/types/news";
import api from "@/lib/axios";

interface NewsCardProps {
  news: News;
  setNews?: React.Dispatch<React.SetStateAction<News[]>>;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, setNews }) => {
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

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden w-80 md:w-80 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 md:h-60 overflow-hidden bg-gray-100">
          <img
            src={news.images?.[0] ?? ""}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Delete button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={handleDelete}
              className="bg-white/90 backdrop-blur p-2 rounded-full text-rose-600 hover:bg-rose-600 hover:text-white transition shadow-md"
              title="Delete"
            >
              <FiTrash size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-3 space-y-1.5">
          <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
            {news.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">
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

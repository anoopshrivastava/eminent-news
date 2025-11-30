import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import EditNewsModal from "./EditNewsModal";
import type { News } from "@/types/news";

interface NewsCardProps {
  news: News;
  setNews?: React.Dispatch<React.SetStateAction<News[]>>;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, setNews }) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/news/${news._id}`,
        { withCredentials: true }
      );

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
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden w-80 md:w-72">
        {/* Image block with edit/delete overlay */}
        <div className="relative h-48 md:h-60 overflow-hidden bg-gray-100">
          <img
            src={news.images?.[0] ?? ""}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Edit & Delete buttons (top-right) */}
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            {/* <button
              onClick={() => setIsEditOpen(true)}
              className="bg-yellow-400 p-1 rounded-full text-black hover:bg-yellow-500 shadow"
              title="Edit"
            >
              <FiEdit />
            </button> */}
            <button
              onClick={handleDelete}
              className="bg-rose-600 p-1 rounded-full text-white hover:bg-rose-700 shadow"
              title="Delete"
            >
              <FiTrash />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 pb-3 pt-2">
          <h3 className="text-lg md:text-base font-semibold line-clamp-2 text-gray-900 leading-[1.1] mb-1">
            Title : {news.title}
          </h3>

          <p className="font-medium text-gray-700 text-sm md:text-xs line-clamp-2 leading-[1.2]">Description : {news.description}</p>

          {/* Author + Follow */}
          <div className="flex items-center justify-between pt-2 md:pt-1.5">
            <div className="text-xs font-medium text-gray-700">
            Editor : {" "}
              <span className="text-gray-600">
                {news.editor?.name ?? "unknown"}
              </span>
            </div>
          </div>

          <div className="pt-1 text-xs font-medium text-gray-700">
            <span className="mr-3">Category : {news.category ?? "Other"}</span>
          </div>
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

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiX, FiLoader } from "react-icons/fi";
import { categories, type News } from "@/types/news";

interface EditNewsModalProps {
  news: News;
  onClose: () => void;
  setNews?: React.Dispatch<React.SetStateAction<News[]>>;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({ news, onClose, setNews }) => {
  const [formData, setFormData] = useState({
    title: news.title,
    description: news.description,
    category: news.category,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImages(files ? Array.from(files) : []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      images.forEach((f) => data.append("images", f));

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/news/${news._id}`,
        data,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      const resData = response?.data ?? {};
      if (resData.success === true) {
        toast.success("News updated");
        if (setNews && resData.news) {
          setNews((prev) => prev.map((n) => (n._id === news._id ? resData.news : n)));
        }
        onClose();
      } else {
        toast.error(resData.message ?? "Failed to update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-lg w-96 md:w-[450px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">Edit News</h2>
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-black">
            <FiX size={20} />
          </button>
        </div>

        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded mb-2 bg-white" />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded bg-white"
          required
        >
          <option  value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded mb-2 h-24 bg-white" />

        <label>New Images (optional)</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded mb-2" />

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 rounded flex-1">
            {loading ? <FiLoader className="animate-spin" /> : "Save"}
          </button>
          <button type="button" onClick={onClose} className="border p-2 rounded flex-1">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditNewsModal;

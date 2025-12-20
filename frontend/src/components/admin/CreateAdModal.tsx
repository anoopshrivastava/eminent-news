import React, { useState } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { compressFile } from "@/lib/compression";
import api from "@/lib/axios";
import { categories, type Ads } from "@/types/ads";

interface props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAds?: () => Promise<void>;
  setAds?: React.Dispatch<React.SetStateAction<Ads[]>>;
}

function CreateAdModal({ setIsOpen, fetchAds, setAds }: props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    category: "Banner",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
  
    const fileArray = Array.from(files);
  
    const compressedFiles: File[] = [];
  
    for (const file of fileArray) {
      const compressed: any = await compressFile(file);
  
      // convert compressed Blob → File (FormData needs File)
      const compressedFile = new File([compressed], file.name.replace(/\.\w+$/, '.webp'), {
        type: compressed.type || 'image/webp'
      });
  
      compressedFiles.push(compressedFile);
    }
  
    setImages(compressedFiles);
    toast.success("Images compressed successfully (under 1MB)");
  };
  

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("url", formData.url);
      data.append("category", formData.category);

      images.forEach((img) => data.append("images", img));

      const response = await api.post("/ads/create",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const resData = response?.data ?? {};
      if (resData.success === false) {
        toast.error("Error creating ads item");
        setError(resData.message ?? "Error creating ads");
        return;
      }

      toast.success("Ads Added Successfully");

      if (fetchAds) await fetchAds();
      else if (setAds && resData.ads) {
        // if API returns created item(s)
        setAds((prev) => [resData.ads, ...prev]);
      }

      setFormData({ title: "", description: "", category: "National", url: "" });
      setImages([]);
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create ads. Please try again.");
      console.error("Error creating ads:", err);
      toast.error("Error creating ads");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <form
        onSubmit={handleCreatePost}
        className="bg-white p-6 rounded-lg shadow-lg w-96 md:w-[450px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">Add An Advertisement</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-black cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {error && <p className="text-[#f40607] text-sm mb-2">{error}</p>}

        <div className="flex flex-col md:flex-row justify-center md:gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="title">Title (optional)</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              disabled={loading}
              className="w-full p-2 border rounded mb-2 bg-transparent text-gray-700"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="w-full md:w-1/2">
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded bg-white"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label htmlFor="description">Description (optional)</label>
        <textarea
          name="description"
          placeholder="Description"
          disabled={loading}
          className="w-full p-2 border rounded mb-2 h-24 bg-transparent text-gray-700"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="w-full">
          <label htmlFor="url">Link Url (optional)</label>
          <input
            type="text"
            name="url"
            placeholder="Link Url"
            disabled={loading}
            className="w-full p-2 border rounded mb-2 bg-transparent text-gray-700"
            value={formData.url}
            onChange={handleChange}
          />
        </div>

        <label>
          Select Images <span className="text-xs text-slate-950">( less than 5mb )</span>
        </label>
        <input
          type="file"
          accept="image/*"
          disabled={loading}
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded mb-2 bg-transparent text-gray-700 cursor-pointer"
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading && <FiLoader className="animate-spin" />}{" "}
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreateAdModal;

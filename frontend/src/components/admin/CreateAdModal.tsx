import React, { useEffect, useState } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { compressFile } from "@/lib/compression";
import api from "@/lib/axios";
import { categories, type Ads } from "@/types/ads";
import { Input } from "../ui/input";

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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.category === "VideoShorts") return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const compressedFiles: File[] = [];

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        continue;
      }

      const compressedBlob: any = await compressFile(file);

      const compressedFile = new File(
        [compressedBlob],
        file.name.replace(/\.\w+$/, ".webp"),
        {
          type: compressedBlob.type || "image/webp",
        }
      );

      compressedFiles.push(compressedFile);
    }

    if (compressedFiles.length === 0) {
      toast.error("No valid images selected");
      return;
    }

    setImages(compressedFiles);
    toast.success("Images compressed successfully");
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (formData.category !== "VideoShorts") return;
    const MAX_SIZE_MB = 150;

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Video must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setVideoFile(file);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("url", formData.url);

      if (formData.category === "VideoShorts" && videoFile) {
        data.append("video", videoFile);
      } else {
        images.forEach((img) => data.append("images", img));
      }

      const response = await api.post("/ads/create", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

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

      setFormData({
        title: "",
        description: "",
        category: "National",
        url: "",
      });
      setImages([]);
      setIsOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Failed to create ads. Please try again."
      );
      console.error("Error creating ads:", err);
      toast.error("Error creating ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setImages([]);
    setVideoFile(null);
  }, [formData.category]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 ">
      <form
        onSubmit={handleCreatePost}
        className="bg-white p-6 rounded-lg shadow-lg w-[95%] md:w-[450px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-rose-600">
            Add An Advertisement
          </h2>
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

        {formData.category === "VideoShorts" ? (
          <>
            <label>Upload Video (≤ 3 min)</label>
            <Input
              type="file"
              accept="video/*"
              disabled={loading}
              onChange={handleVideoChange}
            />
          </>
        ) : (
          <>
            <label>Select Images</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={loading}
              onChange={handleFileChange}
            />
          </>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer bg-rose-600 text-white p-2 rounded hover:bg-rose-700 disabled:bg-gray-400 flex justify-center items-center gap-2 mt-6"
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

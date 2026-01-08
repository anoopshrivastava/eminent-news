import React, { useState, useEffect } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { categories, subCategoriesMap, type News } from "@/types/news";
import { compressFile } from "@/lib/compression";
import api from "@/lib/axios";

interface AddNewsModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchNews?: () => Promise<void>;
  admin?: boolean;
  setNews?: React.Dispatch<React.SetStateAction<News[]>>;
}

function AddNewsModal({ setIsOpen, fetchNews, admin = false, setNews }: AddNewsModalProps) {

  const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB

  const [formData, setFormData] = useState({
    editorId: "",
    title: "",
    description: "",
    category: "National",
    subCategories: [] as string[],
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);


  // reset subCategories when category changes (extra safety)
  useEffect(() => {
    setFormData(prev => ({ ...prev, subCategories: [] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.category]); // intentional: react will warn about missing setter, but this keeps behavior explicit

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // if category changes, also reset subCategories
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value, subCategories: [] }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSubCategory = (sub: string) => {
    setFormData(prev => {
      const exists = prev.subCategories.includes(sub);
      return {
        ...prev,
        subCategories: exists ? prev.subCategories.filter(s => s !== sub) : [...prev.subCategories, sub],
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const compressedFiles: File[] = [];

    for (const file of fileArray) {
      const compressed: any = await compressFile(file);

      // convert compressed Blob → File (FormData needs File)
      const compressedFile = new File([compressed], file.name.replace(/\.\w+$/, ".webp"), {
        type: compressed.type || "image/webp",
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
      data.append("editorId", formData.editorId);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);

      // append subCategories as multiple values (multipart array)
      formData.subCategories.forEach((sc) => data.append("subCategories", sc));

      images.forEach((img) => data.append("images", img));

      if (videoFile) {
        data.append("video", videoFile); 
      }

      const response = await api.post(
        "/news/create",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            const pct = Math.round((evt.loaded * 100) / (evt.total ?? 1));
            setUploadProgress(pct);
          },
        }
      );

      const resData = response?.data ?? {};
      if (resData.success === false) {
        toast.error("Error creating news item");
        setError(resData.message ?? "Error creating news");
        return;
      }

      toast.success("News Added Successfully");

      if (fetchNews) await fetchNews();
      else if (setNews && resData.news) {
        setNews((prev) => [resData.news, ...prev]);
      }

      setFormData({
        editorId: "",
        title: "",
        description: "",
        category: "National",
        subCategories: [],
      });
      setImages([]);
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create news. Please try again.");
      console.error("Error creating news:", err);
      toast.error("Error creating news");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) return setVideoFile(null);

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    if (file.size > MAX_VIDEO_BYTES) {
      setError("Video size must be less than 20MB");
      return;
    }

    setVideoFile(file);
  };


  const availableSubCategories = subCategoriesMap[formData.category] ?? [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <form
        onSubmit={handleCreatePost}
        className="bg-white p-6 rounded-lg shadow-lg w-96 md:w-[550px] max-h-[95%] overflow-y-scroll"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#f40607]">Add News</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-black cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {error && <p className="text-[#f40607] text-sm mb-2">{error}</p>}

        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          disabled={loading}
          className="w-full p-2 border rounded mb-2 bg-transparent text-gray-700"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* <div className="flex flex-col md:flex-row justify-center md:gap-4"> */}
          <div className="w-full">
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

          <div className="w-full">
            <label>Select SubCategories</label>
            <div className="border rounded-lg p-2 max-h-40 overflow-y-auto bg-gray-50">
            {availableSubCategories.length === 0 ? (
              <p className="text-sm text-gray-500">No subcategories available</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSubCategories.map((sub) => {
                  const selected = formData.subCategories.includes(sub);

                  return (
                    <button
                      type="button"
                      key={sub}
                      disabled={loading}
                      onClick={() => toggleSubCategory(sub)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                        ${
                          selected
                            ? "bg-[#f40607] text-white border-red-600 shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                        }
                      `}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {formData.subCategories.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: <span className="font-medium">{formData.subCategories.length}</span>
            </p>
          )}

          </div>
        {/* </div> */}

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          disabled={loading}
          className="w-full p-2 border rounded mb-2 h-24 bg-transparent text-gray-700"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <div className="w-full">
          <label>
            Upload Video <span className="text-xs text-gray-500">(max 20MB)</span>
          </label>
          <input
            type="file"
            accept="video/*"
            disabled={loading}
            onChange={handleVideoChange}
            className="w-full p-2 border rounded mb-2 bg-transparent cursor-pointer"
          />

          {videoFile && (
            <p className="text-xs text-gray-600">
              Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}

          {loading && uploadProgress > 0 && (
            <div className="mt-2">
              <div className="text-xs mb-1">Uploading video: {uploadProgress}%</div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-[#f40607] h-2 rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {admin && (
          <div>
            <label htmlFor="editorId">Editor Id (optional)</label>
            <input
              type="text"
              name="editorId"
              placeholder="Editor Id"
              disabled={loading}
              className="w-full p-2 border rounded mb-2 bg-transparent text-gray-700"
              value={formData.editorId}
              onChange={handleChange}
            />
          </div>
        )}

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
          className="w-full cursor-pointer bg-[#f40607] text-white p-2 rounded hover:bg-red-700 disabled:bg-gray-400 flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading && <FiLoader className="animate-spin" />}{" "}
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default AddNewsModal;

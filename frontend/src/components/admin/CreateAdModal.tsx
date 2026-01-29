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

const ADS_INFO: Record<
  string,
  {
    placement: string;
    spec: string;
  }
> = {
  Banner: {
    placement: "Shown at the top of the homepage in the sliders.",
    spec: "Recommended image ratio: 16:9 (e.g. 1200×675). Image only.",
  },
  Highlights: {
    placement: "Shown between news highlights on the homepage in desktop.",
    spec: "Recommended image ratio: 16:9 (e.g. 1200×675). Image only.",
  },
  FullPageShorts:{
    placement: "Appears in shorts section as full page ad.",
    spec: "Recommended image ratio: 9:16 (vertical). Image only.",
  },
  VideoShorts: {
    placement: "Appears in shorts section.",
    spec: "Video only. Recommended ratio: 9:16 (vertical). Max 3 minutes.",
  },
};


const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const ADS_VIDEO_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

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
      let videoUrl = "";
      let videoPublicId = "";

      // 🔹 VIDEO SHORTS → Cloudinary
      if (formData.category === "VideoShorts") {
        if (!videoFile) {
          toast.error("Please select a video");
          return;
        }

        const cloudForm = new FormData();
        cloudForm.append("file", videoFile);
        cloudForm.append("upload_preset", ADS_VIDEO_PRESET);
        cloudForm.append("folder", "ads/videos");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", CLOUDINARY_URL);

        xhr.onload = async () => {
          const cloudData = JSON.parse(xhr.responseText);

          if (!cloudData.secure_url) {
            toast.error("Video upload failed");
            setLoading(false);
            return;
          }

          videoUrl = cloudData.secure_url;
          videoPublicId = cloudData.public_id;

          await createAd(videoUrl, videoPublicId);
        };

        xhr.onerror = () => {
          toast.error("Video upload failed");
          setLoading(false);
        };

        xhr.send(cloudForm);
      } else {
        // 🔹 IMAGE ADS
        await createAd();
      }
    } catch (err: any) {
      toast.error("Error creating ads");
      setLoading(false);
    }
  };

  const createAd = async (videoUrl?: string, videoPublicId?: string) => {
    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("url", formData.url);

    if (videoUrl && videoPublicId) {
      data.append("videoUrl", videoUrl);
      data.append("videoPublicId", videoPublicId);
    } else {
      images.forEach((img) => data.append("images", img));
    }

    const response = await api.post("/ads/create", data);

    toast.success("Ads Added Successfully");

    if (fetchAds) await fetchAds();
    else if (setAds && response.data.ads) {
      setAds((prev) => [response.data.ads, ...prev]);
    }

    setFormData({
      title: "",
      description: "",
      category: "Banner",
      url: "",
    });
    setImages([]);
    setVideoFile(null);
    setIsOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    setImages([]);
    setVideoFile(null);
  }, [formData.category]);

  const currentAdInfo = ADS_INFO[formData.category];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 ">
      <form
        onSubmit={handleCreatePost}
        className="bg-white p-6 rounded-lg shadow-lg w-[95%] md:w-[450px] max-h-[95%] overflow-y-scroll"
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

        {currentAdInfo && (
          <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <p className="font-semibold mb-1">📍 Where this ad will appear</p>
            <p className="mb-2">{currentAdInfo.placement}</p>

            <p className="font-semibold mb-1">📐 Upload guidelines</p>
            <p>{currentAdInfo.spec}</p>
          </div>
        )}


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

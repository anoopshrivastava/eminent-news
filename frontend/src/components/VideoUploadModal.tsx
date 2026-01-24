import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface Props {
  onUploaded?: () => void;
}

const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject("Failed to load video metadata");
    };
  });
};

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;


export default function VideoUploadModal({ onUploaded }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_DURATION = 180; // 3 minutes
  const MAX_SIZE_MB = 150;

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Get duration using HTML5 video
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > MAX_DURATION) {
        toast.error("Video duration must be 3 minutes or less");
        setVideoFile(null);
        return;
      }

      setVideoFile(file);
    };

    video.src = URL.createObjectURL(file);
  };

const handleUpload = async () => {
  if (!title.trim()) {
    toast.error("Title is required");
    return;
  }

  if (!videoFile) {
    toast.error("Please select a video");
    return;
  }

  try {
    setLoading(true);

    const duration = await getVideoDuration(videoFile);

    if (duration > MAX_DURATION) {
      toast.error("Video must be 3 minutes or less");
      return;
    }

    // 1️⃣ Upload to Cloudinary
    const cloudForm = new FormData();
    cloudForm.append("file", videoFile);
    cloudForm.append("upload_preset", UPLOAD_PRESET);
    cloudForm.append("folder", "videos");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", CLOUDINARY_URL);

    xhr.onload = async () => {
      const cloudData = JSON.parse(xhr.responseText);

      if (!cloudData.secure_url) {
        toast.error("Cloudinary upload failed");
        setLoading(false);
        return;
      }

      // 2️⃣ Save metadata in backend
      await api.post("/videos/upload", {
        title,
        description,
        videoUrl: cloudData.secure_url,
        publicId: cloudData.public_id,
        duration: Math.round(duration),
        videoMimeType: videoFile.type,
        thumbnail: cloudData.secure_url.replace(".mp4", ".jpg"),
        size: videoFile.size,
      });

      toast.success("Video uploaded successfully!");
      setOpen(false);
      setTitle("");
      setDescription("");
      setVideoFile(null);
      onUploaded?.();
      setLoading(false);
    };

    xhr.onerror = () => {
      toast.error("Upload failed");
      setLoading(false);
    };

    xhr.send(cloudForm);

  } catch (err: any) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Upload failed");
    setLoading(false);
  }
};



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Video</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Video (≤ 3 min)</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Video title"
            value={title}
            disabled={loading}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm disabled:opacity-60"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            disabled={loading}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm disabled:opacity-60"
            rows={3}
          />

          <input
            type="file"
            accept="video/*"
            disabled={loading}
            onChange={handleVideoChange}
            className="w-full text-sm disabled:opacity-60"
          />

          {videoFile && (
            <p className="text-xs text-gray-500">
              Selected: {videoFile.name} (
              {(videoFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}

          <Button
            onClick={handleUpload}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

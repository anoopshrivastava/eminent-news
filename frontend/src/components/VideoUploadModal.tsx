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


export default function VideoUploadModal({ onUploaded }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_DURATION = 180; // 3 minutes
  const MAX_SIZE_MB = 200;

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("duration", Math.round(duration).toString());

    await api.post("/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Video uploaded successfully!");
    setOpen(false);
    setTitle("");
    setDescription("");
    setVideoFile(null);
    onUploaded?.();
  } catch (err: any) {
    console.error(err);
    toast.error(
      err?.response?.data?.message || err.message || "Upload failed"
    );
  } finally {
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

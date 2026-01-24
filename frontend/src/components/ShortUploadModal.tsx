import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import api from "@/lib/axios";

const MAX_BYTES = 50 * 1024 * 1024;

type Props = {
  onUploaded: () => void;
};

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

export default function ShortUploadModal({ onUploaded }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files?.[0] ?? null;
    if (!f) return setFile(null);
    if (!f.type.startsWith("video/"))
      return setError("Please select a video file.");
    if (f.size > MAX_BYTES) return setError("File too large. Max 50 MB.");
    setFile(f);
  }

  async function handleSubmit() {
    setError(null);

    if (!file) return setError("Choose a video file.");
    if (!title.trim()) return setError("Title is required.");

    try {
      setUploading(true);
      setProgress(0);

      // 1️⃣ Upload to Cloudinary
      const cloudForm = new FormData();
      cloudForm.append("file", file);
      cloudForm.append("upload_preset", UPLOAD_PRESET);
      cloudForm.append("folder", "shorts");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", CLOUDINARY_URL);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      };

      xhr.onload = async () => {
        const cloudData = JSON.parse(xhr.responseText);

        if (!cloudData.secure_url) {
          setError("Cloudinary upload failed");
          setUploading(false);
          return;
        }

        // 2️⃣ Send metadata to backend
        await api.post("/shorts/upload", {
          title,
          description,
          videoUrl: cloudData.secure_url,
          publicId: cloudData.public_id,
          duration: cloudData.duration,
          videoMimeType: file.type,
          thumbnail: cloudData.secure_url.replace(".mp4", ".jpg"),
        });

        // success
        setTitle("");
        setDescription("");
        setFile(null);
        setOpen(false);
        onUploaded();
        setUploading(false);
        setProgress(0);
      };

      xhr.onerror = () => {
        setError("Upload failed");
        setUploading(false);
      };

      xhr.send(cloudForm);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus size={16} /> Create Short
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Short</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label className="mt-2">Select Short (max 50mb)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFile}
            className="-mt-2"
          />

          {file && (
            <div className="text-sm text-gray-700">
              Selected: {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}

          {uploading && <Progress value={progress} className="mt-2" />}

          {error && <div className="text-sm text-[#f40607]">{error}</div>}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? `Uploading ${progress}%` : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

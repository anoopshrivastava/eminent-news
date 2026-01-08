import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import api from "@/lib/axios";

const MAX_BYTES = 100 * 1024 * 1024;

type Props = {
  onUploaded: () => void;
};

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
    if (!f.type.startsWith("video/")) return setError("Please select a video file.");
    if (f.size > MAX_BYTES) return setError("File too large. Max 100 MB.");
    setFile(f);
  }

  async function handleSubmit() {
    setError(null);
    if (!file) return setError("Choose a video file.");
    if (!title.trim()) return setError("Title is required.");

    const form = new FormData();
    form.append("video", file);
    form.append("title", title);
    form.append("description", description);

    try {
      setUploading(true);
      setProgress(0);
      await api.post("/shorts/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded * 100) / (evt.total ?? 1));
          setProgress(pct);
        },
      });

      // success
      setTitle("");
      setDescription("");
      setFile(null);
      setOpen(false);
      onUploaded();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Upload failed";
      setError(msg);
    } finally {
      setUploading(false);
      setProgress(0);
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
          <input
            type="file"
            accept="video/*"
            onChange={handleFile}
            className="mt-2"
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
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={uploading}>
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

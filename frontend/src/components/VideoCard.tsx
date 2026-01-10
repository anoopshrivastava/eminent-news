
import { Button } from "@/components/ui/button";
import type { Video } from "@/types/video";
import { Trash2, Clock } from "lucide-react";

type Props = {
  video: Video;
  onDelete: (id: string) => Promise<void>;
  deleting?: boolean;
};

export default function VideoCard({ video, onDelete, deleting }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Video preview */}
      <div className="w-full h-56 bg-black flex items-center justify-center">
        <video
          src={video.videoUrl}
          className="w-full h-full object-cover"
          controls
          playsInline
        />
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold line-clamp-2">
              {video.title}
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              {video.editor && typeof video.editor !== "string"
                ? video.editor.name ?? video.editor.email
                : "Unknown"}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <Clock size={12} />
              {video.duration}s •{" "}
              {new Date(video.createdAt).toLocaleString()}
            </div>
          </div>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(video._id)}
            disabled={deleting}
            title="Delete video"
          >
            <Trash2 size={14} />
          </Button>
        </div>

        {video.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

import { type Short } from "@/types/shorts";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  short: Short;
  onDelete: (id: string) => Promise<void>;
  deleting?: boolean;
};

export default function ShortCard({ short, onDelete, deleting }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-56 bg-black/5 flex items-center justify-center">
        {/* HTML5 video preview (autoplay muted loop optional) */}
        <video
          src={short.videoUrl}
          className="w-full h-full object-cover"
          controls
          playsInline
        />
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold line-clamp-2">{short.title}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {short.editor && typeof short.editor !== "string"
                ? short.editor.name ?? short.editor.email
                : "Unknown"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(short.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(short._id)}
              disabled={deleting}
              title="Delete short"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        {short.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{short.description}</p>
        )}
      </div>
    </div>
  );
}

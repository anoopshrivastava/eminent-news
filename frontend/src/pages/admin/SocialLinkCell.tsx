import { FiExternalLink, FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";

type Props = {
  url?: string;
};

function SocialLinkCell({ url }: Props) {
  if (!url) return <span className="text-gray-400">—</span>;

  return (
    <div className="flex items-center gap-2">
      {/* Open link */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
      >
        Open <FiExternalLink size={14} />
      </a>

      {/* Copy link */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast.success("Link copied!");
        }}
        className="text-gray-500 hover:text-black"
        title="Copy link"
      >
        <FiCopy size={14} />
      </button>
    </div>
  );
}

export default SocialLinkCell;

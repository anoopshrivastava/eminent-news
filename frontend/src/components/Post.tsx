import type { NewsPost } from "@/pages/home/HomePage";

const Post = ({ news }: { news: NewsPost }) => {
  return (
    <div
      key={`${news.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <img
        src={news.image}
        alt={news.title}
        className="w-full h-48 object-cover hover:scale-105 transition"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{news.title}</h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{news.description}</p>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-red-500 font-medium hover:underline"
        >
          Read more →
        </a>
        <footer className="text-gray-400 text-xs mt-3">
          By <span className="font-medium text-gray-700">{news.author}</span> —{" "}
          {news.date}
        </footer>
      </div>
    </div>
  );
};

export default Post;

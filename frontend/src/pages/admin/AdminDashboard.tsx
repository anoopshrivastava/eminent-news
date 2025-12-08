import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import useDebounce from "@/lib/useDebounce";
import AddNewsModal from "@/components/admin/AddNewsModal";
import SearchInput from "@/components/SearchInput";
import Card from "@/components/admin/Card";
import { categories, type News } from "@/types/news";
import api from "@/lib/axios";

const AdminDashboard: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");

  const debouncedSearch = useDebounce(search, 500);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/news?searchKey=${encodeURIComponent(debouncedSearch)}&category=${encodeURIComponent(category)}`);

      const data = response?.data ?? {};
      if (data.success === true) {
        const list: News[] = data.news ?? data.data ?? [];
        setNews(list);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category]);

  return (
    <div className="flex-1 flex-col px-4 min-h-screen">
      <div className="flex items-center gap-6 mb-8 pr-10">
        <h1 className="text-3xl font-bold text-blue-900">All News</h1>

        <div>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            isLoading={loading}
          />
        </div>

        <div className="flex flex-col w-40 gap-1">
        <select
             id="category"
             className="rounded-lg border p-2 w-full bg-white"
             onChange={(e) => setCategory(e.target.value)}
             value={category}
            >
              <option value="all" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
        </div>

        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg hover:opacity-90 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          Add News
        </button>

        {isOpen && (
          <AddNewsModal
            setIsOpen={setIsOpen}
            fetchNews={fetchNews}
            admin={true}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-full h-80">
          <FiLoader className="animate-spin text-blue-600 text-4xl" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center w-full text-xl text-gray-500">
          No News Found
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-8">
          {news.map((item) => (
            <Card key={item._id} news={item} setNews={setNews} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import useDebounce from "@/lib/useDebounce";
import AddNewsModal from "@/components/admin/AddNewsModal";
import SearchInput from "@/components/SearchInput";
import Card from "@/components/admin/Card";
import { categories, type News } from "@/types/news";
import api from "@/lib/axios";
import { Pagination } from "@/components/Pagination";

const AdminDashboard: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useDebounce(search, 500);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/news/admin?searchKey=${encodeURIComponent(debouncedSearch)}&category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`);

      const data = response?.data ?? {};
      console.log(data)
      if (data.success === true) {
        const list: News[] = data.news ?? data.data ?? [];
        setNews(list);
        setTotal(data.totalCount);
        setTotalPages(data.totalPages)
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
    setPage(1);
  }, [debouncedSearch, category, limit]);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category, page, limit]);

  return (
    <div className="flex-1 flex-col px-4 min-h-screen">
      <div className="flex items-center gap-6 mb-8 pr-10">
        <h1 className="text-3xl font-bold text-black">All News</h1>

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
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 rounded-lg hover:opacity-90 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          Add News
        </button>

        {isOpen && (
          <AddNewsModal
            setIsOpen={setIsOpen}
            fetchNews={fetchNews}
            setNews={setNews}
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
            <Card key={item._id} news={item} setNews={setNews} isAdmin={true}/>
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={limit}
        onLimitChange={(val: number) => setLimit(val)}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import Card from "../../components/admin/Card";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchInput from "../../components/SearchInput";
import useDebounce from "@/lib/useDebounce";
import AddNewsModal from "@/components/admin/AddNewsModal";
import { categories, type News } from "@/types/news";
import api from "@/lib/axios";
import { Pagination } from "@/components/Pagination";

const EditorDashboard = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const currentUser = useSelector((state: any) => state.user.currentUser);

  // 🔥 Fix redirect logic (never redirect inside render)
  useEffect(() => {
    if (!currentUser || currentUser.role !== "editor") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const editorId = currentUser?._id;

  const fetchNews = async () => {
    if (!editorId) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/editor/news/${editorId}?searchKey=${debouncedSearch}&category=${category}&page=${page}&limit=${limit}`
      );

      const data = response?.data ?? {};
      if (data.success === true) {
        const list: News[] = data.news ?? data.data ?? [];
        setNews(list);
        setTotal(data.totalCount);
        setTotalPages(data.totalPages);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editorId) {
      fetchNews();
    }
  }, [debouncedSearch, category, editorId]);

  return (
    <div className="flex-1 flex-col px-4 min-h-screen">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 md:pr-10">
        <h1 className="text-3xl font-bold text-black">My News</h1>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          isLoading={loading}
        />

        <div className="flex flex-col w-full md:w-40 gap-1">
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
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 rounded-lg hover:opacity-90"
          onClick={() => setIsOpen(true)}
        >
          Add News
        </button>

        {isOpen && (
          <AddNewsModal
            setIsOpen={setIsOpen}
            fetchNews={fetchNews}
            setNews={setNews}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-full h-80">
          <FiLoader className="animate-spin text-green-600 text-4xl" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center w-full text-xl text-gray-500">
          No News Found
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-8">
          {news.map((news: News, index: number) => (
            <Card
              key={news._id || index}
              news={news}
              setNews={setNews}
              isAdmin={false}
            />
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

export default EditorDashboard;

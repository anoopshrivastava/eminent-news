import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import api from "@/lib/axios";
import { categories, type Ads } from "@/types/ads";
import AdsCard from "@/components/admin/AdsCard";
import CreateAdModal from "@/components/admin/CreateAdModal";
import { useSelector } from "react-redux";
import { Pagination } from "@/components/Pagination";

const AdsPage: React.FC = () => {
  const [ads, setAds] = useState<Ads[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("all");

  const { currentUser } = useSelector((state: any) => state.user);
  const isAdmin = currentUser?.role === "admin";

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/my-ads?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`
      );

      const data = response?.data ?? {};
      if (data.success === true) {
        const list: Ads[] = data.ads ?? data.data ?? [];
        setAds(list);
        setTotalPages(data.totalPages)
        setTotal(data.totalCount)
      } else {
        setAds([]);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [category, limit]);

  useEffect(() => {
    fetchAds();
  }, [category, page, limit]);

  return (
    <div className="flex-1 flex-col px-4 min-h-screen">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 md:pr-10">
        <h1 className="text-3xl font-bold text-black">All Ads</h1>

        <div className="flex flex-col w-full md:w-40 gap-1">
          <select
            id="category"
            className="rounded-lg border p-2 w-full bg-white"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="all">
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
          className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-3 py-2 rounded-lg hover:opacity-90 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          Add Ads
        </button>

        {isOpen && (
          <CreateAdModal
            setIsOpen={setIsOpen}
            fetchAds={fetchAds}
            setAds={setAds}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-full h-80">
          <FiLoader className="animate-spin text-blue-600 text-4xl" />
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center w-full text-xl text-gray-500">
          No Ads Found
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-8">
          {ads.map((item) => (
            <AdsCard
              key={item._id}
              ads={item}
              setAds={setAds}
              isAdmin={isAdmin}
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

export default AdsPage;

import React, { useEffect, useState } from "react";
import { FiLoader, FiPlus } from "react-icons/fi";
import api from "@/lib/axios";
import { categories, type Ads } from "@/types/ads";
import AdsCard from "@/components/admin/AdsCard";
import CreateAdModal from "@/components/admin/CreateAdModal";
import { useSelector } from "react-redux";

const UserAds: React.FC = () => {
  const [ads, setAds] = useState<Ads[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  const { currentUser } = useSelector((state: any) => state.user);
  const isAdmin = currentUser?.role === "admin";

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/my-ads?category=${encodeURIComponent(category)}`);
      if (res.data?.success) {
        setAds(res.data.ads || []);
      } else {
        setAds([]);
      }
    } catch (err) {
      console.error(err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [category]);

  return (
    <div className="min-h-screen px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Advertisements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, manage and track your ads
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-44 rounded-lg border px-3 py-2 bg-white text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            <FiPlus />
            Run My Ads
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <CreateAdModal
          setIsOpen={setIsOpen}
          fetchAds={fetchAds}
          setAds={setAds}
        />
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <FiLoader className="animate-spin text-rose-600 text-4xl" />
        </div>
      ) : ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-[50vh] gap-4">
          <div className="text-5xl">📢</div>
          <h3 className="text-lg font-semibold text-gray-700">
            No ads yet
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Create your first advertisement and submit it for approval.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700"
          >
            Create Ad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
};

export default UserAds;

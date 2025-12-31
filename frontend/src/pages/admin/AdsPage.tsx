import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import api from "@/lib/axios";
import { categories, type Ads } from "@/types/ads";
import AdsCard from "@/components/admin/AdsCard";
import CreateAdModal from "@/components/admin/CreateAdModal";

const AdsPage: React.FC = () => {
  const [ads, setAds] = useState<Ads[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("all");

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/ads?category=${encodeURIComponent(category)}`);

      const data = response?.data ?? {};
      if (data.success === true) {
        const list: Ads[] = data.ads ?? data.data ?? [];
        setAds(list);
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
    fetchAds();
  }, [category]);

  return (
    <div className="flex-1 flex-col px-4 min-h-screen">
      <div className="flex items-center gap-6 mb-8 pr-10">
        <h1 className="text-3xl font-bold text-black">All Ads</h1>

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
            <AdsCard key={item._id} ads={item} setAds={setAds} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsPage;

import React, { useEffect, useState } from "react";
import Post from "@/components/Post";
import Loading from "@/components/Loading";
import { type News } from "@/types/news";
import api from "@/lib/axios";

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/news`);

      const data = response?.data ?? {};
      if (data.success === true) {
        setNews(data.news ?? data.data ?? []);
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
  }, []);

  if (loading) return <div className="min-h-[100vh]"><Loading /></div>;

  return (
    <div className="min-h-screen md:py-2">
      <div className="md:px-8 mx-4 md:mx-20">

        <hr className="my-4 border-t border-gray-200" />

        {/* 📱 MOBILE ONLY – All News List */}
        <section className="block md:hidden container mx-auto">
          <div className="pb-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-red-500 inline-block pb-1">
              All News
            </h2>
          </div>

          {/* All News Grid */}
          <div className="grid grid-cols-1 gap-8">
            {news.length > 0 ? (
              news.map((item) => (
                <Post key={item._id} news={item} fetchNews={fetchNews} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">No news posts found.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default NewsPage;

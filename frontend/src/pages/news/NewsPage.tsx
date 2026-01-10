import React, { useEffect, useState } from "react";
// import Post from "@/components/Post";
import Loading from "@/components/Loading";
import { type News } from "@/types/news";
import api from "@/lib/axios";
import PostX from "@/components/PostX";
import { useSearchParams } from "react-router-dom";

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/news`, {
        params: {
          category: category ?? undefined,
        },
      });

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
  }, [category, subCategory]);

  if (loading)
    return (
      <div className="min-h-[100vh]">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen -mt-2 md:mt-0">
      <div className="md:px-8 mx-4 md:mx-20 pb-8">
        <hr className="my-4 border-t border-gray-200" />

        {/* 📱 MOBILE ONLY – All News List */}
        <section className=" container mx-auto">
          <div className="pb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b inline-block">
              All News
              {category && (
                <span className="text-rose-500 font-semibold text-[17px] md:text-[20px] pl-1 md:pl-3">
                  {" "}
                  • {category}
                  {subCategory && ` / ${subCategory}`}
                </span>
              )}
            </h2>
          </div>

          {/* All News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.length > 0 ? (
              news.map((item) => (
                <PostX key={item._id} news={item} fetchNews={fetchNews} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                No news posts found.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsPage;

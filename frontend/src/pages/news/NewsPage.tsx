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
  const search = searchParams.get("search");

  const LIMIT = 200;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
  const isFetchingRef = React.useRef(false);

  const fetchNews = async (pageNo = 1) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (pageNo === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await api.get(`/news`, {
        params: {
          category: category ?? undefined,
          searchKey: search ?? undefined,
          page: pageNo,
          limit: LIMIT,
        },
      });

      const data = response?.data ?? {};
      if (pageNo === 1) {
        setNews(data.news);
      } else {
        setNews((prev) => [...prev, ...data.news]);
      }
      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

useEffect(() => {
  setPage(1);
  setHasMore(true);
  setNews([]);
  fetchNews(1);
}, [category, subCategory, search]);

useEffect(() => {
  if (!loadMoreRef.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (
        entry.isIntersecting &&
        hasMore &&
        !isFetchingRef.current
      ) {
        setPage((prev) => prev + 1);
      }
    },
    { rootMargin: "200px" }
  );

  observer.observe(loadMoreRef.current);

  return () => observer.disconnect();
}, [hasMore]);



useEffect(() => {
  if (page > 1) {
    fetchNews(page);
  }
}, [page]);


console.log({ page, hasMore, loadingMore });


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
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.length > 0 ? (
              news.map((item) => (
                <PostX key={item._id} news={item} fetchNews={fetchNews} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                No news posts found.
              </p>
            )}
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <PostX key={item._id} news={item} fetchNews={fetchNews} />
            ))}
          </div>

          {/* Infinite loader */}
          <div
            ref={loadMoreRef}
            className="h-16 flex justify-center items-center"
          >
            {hasMore && loadingMore && <Loading />}
          </div>

          {!hasMore && (
            <p className="text-center text-gray-400 py-6">
              You’ve reached the end 👋
            </p>
          )}


        </section>
      </div>
    </div>
  );
};

export default NewsPage;

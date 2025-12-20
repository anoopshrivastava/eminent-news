import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import img4 from "@/assets/w1.jpeg";
import HeroCarousel from "./components/HeroCarousel";
import { Trophy } from "lucide-react";
import FAQ from "@/components/FAQ";
import { categories, type News } from "@/types/news";
import Loading from "@/components/Loading";
import api from "@/lib/axios";
import PostX from "@/components/PostX";
import Post3 from "@/components/Post3";
import type { Ads } from "@/types/ads";

const featured = {
  _id: "ddlkfj",
  title: "Startup Revolutionises Last-Mile Delivery",
  description:
    "A local startup has piloted an autonomous delivery network that reduces delivery times and cuts carbon emissions in dense cities.",
  author: "Rahul Desai",
  date: "November 9, 2025",
  images: img4,
  url: "https://example.com/news/trending/302",
  likes: 33,
};

const HomePage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [ads, setAds] = useState<Ads[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupedNews, setGroupedNews] = useState<{
    national: News[];
    world: News[];
    trending: News[];
    sports: News[];
  }>({
    national: [],
    world: [],
    trending: [],
    sports: [],
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/news`);

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

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/ads`);

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
    fetchNews();
    fetchAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      const grouped = {
        national: news.filter((n) => n.category === "National"),
        world: news.filter((n) => n.category === "World"),
        trending: news.filter((n) => n.category === "Trending"),
        sports: news.filter((n) => n.category === "Sports"),
      };
      setGroupedNews(grouped);
    }
  }, [news]);

  if (loading) return (
    <div className="min-h-[100vh]">
      <Loading />
    </div>
  );

  const bannerAds = ads.filter((ad) => ad.category === "Banner");
  const highlightAds = ads.filter((ad) => ad.category === "Highlights");

  const getHighlightAd = (position: number) => highlightAds[position % highlightAds.length];
  
  return (
    <div className="min-h-screen md:py-2">
      {/* Hero / Featured Section*/}
      <HeroCarousel ads={bannerAds} />
      <div className=" md:px-8 mx-4 md:mx-8">
        {/* Mobile Tabbed News Section (Consolidated Categories) */}
        <section className="block md:hidden container mx-auto mt-6">
          <div className="pb-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-red-500 inline-block pb-1">
              Explore Categories 📰
            </h2>
          </div>

          {/* Tabs Component */}
          <Tabs defaultValue={categories[0]}>
            <TabsList className="w-full overflow-x-scroll bg-white h-12">
              {categories.map((category, index) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={`py-2 data-[state=active]:bg-[#f40607] data-[state=active]:text-white data-[state=active]:shadow-md transition-colors duration-200 text-gray-700 font-semibold ${
                    index === 0 && "ml-36"
                  }`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => {
              const key = category.toLowerCase();
              return (
                <TabsContent
                  key={category}
                  value={category}
                  className="mt-6 p-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {groupedNews[key as keyof typeof groupedNews]?.length ? (
                      groupedNews[key as keyof typeof groupedNews].map(
                        (item: News) => (
                          <PostX
                            key={item._id}
                            news={item}
                            fetchNews={fetchNews}
                          />
                        )
                      )
                    ) : (
                      <p className="col-span-4 text-center text-gray-500 p-10">
                        No posts found for this category.
                      </p>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </section>

        {/* desktop mode */}
        <section className="hidden md:flex flex-col gap-4 container mx-auto pt-4">
          <div className="flex gap-10 mt-8">
            <div className="relative w-[70%] space-y-12">
              {/* todays highlight section */}
              {news.length > 0 && (
                <div className="border rounded-lg">
                  <div className="absolute -top-6 left-5">
                    <h3 className="w-64 bg-[#f40607] py-2 px-4 text-xl text-white font-bold rounded-full flex items-center gap-2">
                      <Trophy size={22} />
                      Todays Highlights
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 border-gray-500 border-b py-8 px-4 last:border-none">
                  {[...news]
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((item, index) => (
                      <>
                      <Post3 key={item._id} news={item} fetchNews={fetchNews} />
                      {(index === 4 || index === 9) && highlightAds.length > 0 && (
                        <div className="my-6 rounded-lg overflow-hidden border">
                          <img
                            src={getHighlightAd(index).images[0]}
                            alt="Advertisement"
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}

                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-[30%] border px-4 rounded-md">
              <div className="absolute -top-6 ">
                <h3 className="w-64 bg-[#f40607] py-1 px-4 text-xl text-white font-bold rounded-full flex items-center gap-1">
                  <span className="text-2xl">⚡</span> Latest News
                </h3>
              </div>

              {featured && (
                <div className="mb-6 mt-8">
                  <div className="relative rounded-md overflow-hidden">
                    <img
                      src={featured.images}
                      alt={featured.title}
                      className="w-full h-48 object-cover"
                    />

                    {/* Overlay Date + Title */}
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-xs mb-1">{featured.date}</p>
                      <h2 className="text-lg font-semibold text-white leading-snug">
                        {featured.title}
                      </h2>
                    </div>
                  </div>
                </div>
              )}

              {/* 📰 OTHER SMALL NEWS LIST */}
              <div className="space-y-7">
                {groupedNews.national.map((item: News) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-3 border-b pb-3 last:border-none"
                  >
                    {/* Image */}
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-28 h-28 rounded object-cover"
                    />

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-1">
                        By {item.editor?.name} / {item.createdAt.split("T")[0]}
                      </p>
                      <p className="text-[10px] line-clamp-2">
                        {item.description}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-[#f40607] font-medium text-sm "
                      >
                        Read more →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FAQ />
      </div>
    </div>
  );
};

export default HomePage;

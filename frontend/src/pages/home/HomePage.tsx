import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HeroCarousel from "./components/HeroCarousel";
import { Trophy } from "lucide-react";
import FAQ from "@/components/FAQ";
import { categories, type Editor, type News } from "@/types/news";
import Loading from "@/components/Loading";
import api from "@/lib/axios";
import PostX from "@/components/PostX";
import Post3 from "@/components/Post3";
import type { Ads } from "@/types/ads";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/avatar";
import { HighlightImageSlider, VideoAdSlider } from "./components/sliders";

const HomePage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [bannerAds, setBannerAds] = useState<Ads[]>([]);
  const [highlightImageAds, setHighlightImageAds] = useState<Ads[]>([]);
  const [videoAds16by9, setVideoAds16by9] = useState<Ads[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [editors, setEditors] = useState<Editor[]>([]);
  const [followingIds, setFollowingIds] = useState<Record<string, boolean>>({});

  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [mobileNews, setMobileNews] = useState<News[]>([]);
  const [mobileLoading, setMobileLoading] = useState<boolean>(false);
  const [nationalNews, setNationalNews] = useState<News[]>([]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [
        newsRes,
        editorsRes,
        nationalRes,
        bannerRes,
        highlightRes,
        videoRes,
      ] = await Promise.all([
        api.get("/news"),
        api.get("/editors/suggestion?limit=5&verified=true"),
        api.get("/news?category=National&limit=10"),
        api.get("/ads?category=Banner&limit=10"),
        api.get("/ads?category=Highlights&limit=10"),
        api.get("/ads?category=Video&limit=10"),
      ]);

      // NEWS
      if (newsRes.data?.success) {
        setNews(newsRes.data.news ?? newsRes.data.data ?? []);
      } else {
        setNews([]);
      }

      // BANNER ADS (hero)
      const banners = bannerRes.data?.ads ?? bannerRes.data?.data ?? [];
      setBannerAds(banners);

      // HIGHLIGHT IMAGE ADS (for top slider + image slots)
      const highlights =
        highlightRes.data?.ads ?? highlightRes.data?.data ?? [];
      setHighlightImageAds(highlights);

      // VIDEO ADS (16:9) for in-feed video slider
      const videos = videoRes.data?.ads ?? videoRes.data?.data ?? [];
      setVideoAds16by9(videos);

      // EDITORS
      const editorsList =
        editorsRes.data?.users ?? editorsRes.data?.editors ?? [];
      setEditors(editorsList);

      // NATIONAL NEWS
      setNationalNews(nationalRes.data?.news ?? []);
    } catch (err) {
      console.error("Initial data load failed", err);
      setNews([]);
      setBannerAds([]);
      setHighlightImageAds([]);
      setVideoAds16by9([]);
      setEditors([]);
      setNationalNews([]);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchNewsByCategory = async (category: string) => {
    setMobileLoading(true);
    try {
      const response = await api.get(`/news?category=${category}&limit=30`);

      const data = response?.data ?? {};
      if (data.success) {
        setMobileNews(data.news ?? data.data ?? []);
      } else {
        setMobileNews([]);
      }
    } catch (err) {
      console.error("Error fetching category news", err);
      setMobileNews([]);
    } finally {
      setMobileLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchNewsByCategory(activeCategory);
  }, [activeCategory]);

  if (loading)
    return (
      <div className="min-h-[100vh]">
        <Loading />
      </div>
    );

  const toggleFollow = (editorId: string) => {
    setFollowingIds((prev) => {
      const next = { ...prev, [editorId]: !prev[editorId] };
      toast.success(next[editorId] ? "Followed" : "Unfollowed");
      return next;
    });
  };

  const renderInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    const initials = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
    return initials.toUpperCase();
  };

  const featured =
    news.find((n) => n.category === "Trending") ??
    news.find((n) => n.category === "National") ??
    news.find((n) => n.category === "Sports") ??
    news.find((n) => n.category === "Entertainment");

  return (
    <div className="min-h-screen md:py-2">
      {/* Hero / Featured Section*/}
      <HeroCarousel ads={bannerAds} />
      <div className=" md:px-8 mx-4 md:mx-8">
        {/* Mobile Tabbed News Section (Consolidated Categories) */}
        <section className="block md:hidden container mx-auto mt-6">
          <div className="pb-2">
            <h2 className="text-3xl font-bold text-gray-800  inline-block pb-1">
              Explore Categories
            </h2>
          </div>

          {/* Tabs Component */}
          <Tabs
            value={activeCategory}
            onValueChange={(val) => setActiveCategory(val)}
          >
            <TabsList className="w-full overflow-x-scroll bg-white h-12 border-y-2 border-red-500 rounded-none">
              {categories.map((category, index) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={`py-2 data-[state=active]:bg-[#f40607] data-[state=active]:text-white data-[state=active]:shadow-md transition-colors duration-200 text-gray-700 font-semibold  ${
                    index === 0 && "ml-48"
                  }`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-6 p-0">
              {mobileLoading ? (
                <Loading />
              ) : mobileNews.length ? (
                <div className="grid grid-cols-1 gap-6">
                  {mobileNews.map((item, index) => {
                    const showAd =
                      (index + 1) % 5 === 0 && highlightImageAds.length > 0;

                    const adIndex =
                      Math.floor(index / 5) % highlightImageAds.length;
                    const ad = highlightImageAds[adIndex];

                    return (
                      <React.Fragment key={item._id}>
                        <PostX
                          news={item}
                          fetchNews={() => fetchNewsByCategory(activeCategory)}
                        />

                        {/* Static Highlight Ad (mobile only) */}
                        {showAd && ad?.images?.[0] && (
                          <div className="my-4 rounded-lg overflow-hidden border">
                            <a
                              href={ad.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={ad.images[0]}
                                alt={ad.title || "Sponsored"}
                                className="w-full h-48 object-cover"
                              />
                            </a>

                            {ad.title && (
                              <div className="px-2 py-1 text-xs text-gray-700">
                                Sponsored (Ads)
                              </div>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 p-10">
                  No posts found for this category.
                </p>
              )}
            </TabsContent>
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
                    {news.map((item, index) => (
                      <>
                        <Post3
                          key={item._id}
                          news={item}
                          fetchNews={fetchNews}
                        />
                        {
                          index === 4 && (
                            <HighlightImageSlider ads={highlightImageAds} />
                          )
                          // (() => {
                          //   const ad = getHighlightAd(index);
                          //   if (!ad || !ad.images || ad.images.length === 0)
                          //     return null;

                          //   return (
                          //     <div className="my-6 rounded-lg overflow-hidden border">
                          //       <img
                          //         src={ad.images[0]}
                          //         alt="Advertisement"
                          //         className="w-full h-64 object-cover"
                          //       />
                          //     </div>
                          //   );
                          // })()}
                        }
                        {index === 9 && <VideoAdSlider ads={videoAds16by9} />}
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
                      src={featured.images[0]}
                      alt={featured.title}
                      className="w-full h-48 object-cover"
                    />

                    {/* Overlay Date + Title */}
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-xs mb-1">
                        {featured.createdAt.split("T")[0]}
                      </p>
                      <h2 className="text-lg font-semibold text-white leading-snug">
                        {featured.title}
                      </h2>
                    </div>
                  </div>
                </div>
              )}

              {/* 📰 OTHER SMALL NEWS LIST */}
              <div className="space-y-7">
                {nationalNews.map((item: News) => (
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
                      <Link
                        to={`/news/${item._id}`}
                        rel="noopener noreferrer"
                        className="inline-block text-[#f40607] font-medium text-sm "
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* ===== New: Whom to follow section (desktop only) ===== */}
              <div className="mt-6 rounded-lg bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold">Follow Suggestions</h4>
                </div>

                {editors.length === 0 ? (
                  <p className="text-sm text-gray-500">No suggestions found.</p>
                ) : (
                  <div className="space-y-3">
                    {editors.map((ed) => (
                      <div
                        key={ed._id}
                        className="flex items-center justify-between gap-3"
                      >
                        <Link
                          to={`/profile/${ed._id}`}
                          className="flex items-center gap-3"
                        >
                          {ed.avatar ? (
                            <Avatar className="w-10 h-10">
                              <img src={ed.avatar} alt="" />
                            </Avatar>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                              {renderInitials(ed.name)}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ed.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{ed.username}
                            </div>
                          </div>
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFollow(ed._id)}
                            className={`px-3 py-1 text-sm rounded-full border font-medium ${
                              followingIds[ed._id]
                                ? "bg-[#f40607] text-white border-[#f40607]"
                                : "text-[#f40607] border-[#f40607] bg-white"
                            }`}
                          >
                            {followingIds[ed._id] ? "Following" : "Follow"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* ===== end Whom to follow section ===== */}
            </div>
          </div>
        </section>

        <FAQ />
      </div>
    </div>
  );
};

export default HomePage;

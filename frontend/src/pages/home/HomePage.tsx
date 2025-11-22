import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Post from "@/components/Post";
import img1 from "@/assets/N1.jpeg";
import img2 from "@/assets/s2.jpeg";
import img3 from "@/assets/t1.jpg";
import img4 from "@/assets/w1.jpeg";
import pm from "@/assets/pm.webp";
import pgn from "@/assets/pgn.webp";
import sport from "@/assets/sport2.webp";
import HeroCarousel from "./components/HeroCarousel";
import { Flag, Flame, Globe2, Trophy } from "lucide-react";

// --- Data Types and Definitions (Unchanged) ---
export type NewsPost = {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  image: string;
  url: string;
  likes: number;
};

export const categories = [
  { key: "national", label: "National" },
  { key: "world", label: "World" },
  { key: "trending", label: "Trending" },
  { key: "sports", label: "Sports" },
];

const national: NewsPost[] = [
  {
    id: 101,
    title: "Government Announces New Education Reform",
    description:
      "The government unveiled a new policy focused on curriculum updates, teacher training and digital classrooms to improve learning outcomes across the country.",
    author: "Vastvik Rao",
    date: "November 13, 2025",
    image: pgn,
    url: "https://example.com/news/national/101",
    likes: 5,
  },
  {
    id: 102,
    title: "Infrastructure Push: Major Highways Approved",
    description:
      "Funding has been approved for several interstate highways and bridges to boost connectivity and reduce travel time between metropolitan centres.",
    author: "Anita Sen",
    date: "November 12, 2025",
    image: img3,
    url: "https://example.com/news/national/102",
    likes: 2,
  },
  {
    id: 103,
    title: "Healthcare Initiative Expands in Rural Areas",
    description:
      "A new mobile health clinic program aims to deliver primary care services to remote and underserved villages, leveraging telemedicine for specialist consults.",
    author: "Dr. Rohit Mehra",
    date: "November 11, 2025",
    image: sport,
    url: "https://example.com/news/national/103",
    likes: 19,
  },
];

const world: NewsPost[] = [
  {
    id: 201,
    title: "Global Summit Focuses on Climate Finance",
    description:
      "Leaders gather to discuss funding mechanisms for climate adaptation and mitigation in developing nations.",
    author: "Liu Wei",
    date: "November 12, 2025",
    image: img1,
    url: "https://example.com/news/world/201",
    likes: 7,
  },
  {
    id: 202,
    title: "Trade Talks Resume Between Major Economies",
    description:
      "Negotiators from key trading partners have returned to the table to hammer out tariffs, supply chain rules and digital trade standards.",
    author: "Emma Clarke",
    date: "November 10, 2025",
    image: img4,
    url: "https://example.com/news/world/202",
    likes: 1,
  },
];

const trending: NewsPost[] = [
  {
    id: 301,
    title: "Study Shows Rise in Urban Green Spaces",
    description:
      "Recent research highlights the benefits of green roofs, pocket parks and urban tree planting on mental health and air quality.",
    author: "Priya Nair",
    date: "November 10, 2025",
    image: img2,
    url: "https://example.com/news/trending/301",
    likes: 0,
  },
  {
    id: 302,
    title: "Startup Revolutionises Last-Mile Delivery",
    description:
      "A local startup has piloted an autonomous delivery network that reduces delivery times and cuts carbon emissions in dense cities.",
    author: "Rahul Desai",
    date: "November 9, 2025",
    image: pm,
    url: "https://example.com/news/trending/302",
    likes: 33,
  },
  {
    id: 303,
    title: "Viral Challenge Promotes Community Cleanups",
    description:
      "A viral social media challenge is encouraging communities to organise neighbourhood cleanups and share before-and-after stories online.",
    author: "Sana K.",
    date: "November 8, 2025",
    image: img3,
    url: "https://example.com/news/trending/303",
    likes: 14,
  },
];

const sports: NewsPost[] = [
  {
    id: 401,
    title: "National League: Semi-Final Upset Thrills Fans",
    description:
      "An underdog team secured a dramatic victory in the semi-final, setting up a highly anticipated final next week.",
    author: "Arjun Patel",
    date: "November 9, 2025",
    image: sport,
    url: "https://example.com/news/sports/401",
    likes: 2,
  },
  {
    id: 402,
    title: "Record-Breaking Performance at State Championships",
    description:
      "Several athletes set new state records in track and field events, marking a high-performance weekend for the sport.",
    author: "Meera Kapoor",
    date: "November 8, 2025",
    image: img4,
    url: "https://example.com/news/sports/402",
    likes: 8,
  },
  {
    id: 403,
    title: "Youth Academy Produces National Team Prospects",
    description:
      "A local academy has developed multiple young players who are now being scouted for national youth squads.",
    author: "Karan Joshi",
    date: "November 7, 2025",
    image: img2,
    url: "https://example.com/news/sports/403",
    likes: 21,
  },
  {
    id: 401,
    title: "National League: Semi-Final Upset Thrills Fans",
    description:
      "An underdog team secured a dramatic victory in the semi-final, setting up a highly anticipated final next week.",
    author: "Arjun Patel",
    date: "November 9, 2025",
    image: img1,
    url: "https://example.com/news/sports/401",
    likes: 2,
  },
];

const latestNews: NewsPost[] = [
  {
    id: 401,
    title: "National League: Semi-Final Upset Thrills Fans",
    description:
      "An underdog team secured a dramatic victory in the semi-final, setting up a highly anticipated final next week.",
    author: "Arjun Patel",
    date: "November 9, 2025",
    image: img4,
    url: "https://example.com/news/sports/401",
    likes: 2,
  },
  {
    id: 402,
    title: "Record-Breaking Performance at State Championships",
    description:
      "Several athletes set new state records in track and field events, marking a high-performance weekend for the sport.",
    author: "Meera Kapoor",
    date: "November 8, 2025",
    image: img1,
    url: "https://example.com/news/sports/402",
    likes: 8,
  },
  {
    id: 403,
    title: "Youth Academy Produces National Team Prospects",
    description:
      "A local academy has developed multiple young players who are now being scouted for national youth squads.",
    author: "Karan Joshi",
    date: "November 7, 2025",
    image: img2,
    url: "https://example.com/news/sports/403",
    likes: 21,
  },
  {
    id: 401,
    title: "National League: Semi-Final Upset Thrills Fans",
    description:
      "An underdog team secured a dramatic victory in the semi-final, setting up a highly anticipated final next week.",
    author: "Arjun Patel",
    date: "November 9, 2025",
    image: img4,
    url: "https://example.com/news/sports/401",
    likes: 2,
  },
  {
    id: 402,
    title: "Record-Breaking Performance at State Championships",
    description:
      "Several athletes set new state records in track and field events, marking a high-performance weekend for the sport.",
    author: "Meera Kapoor",
    date: "November 8, 2025",
    image: img1,
    url: "https://example.com/news/sports/402",
    likes: 8,
  },
  {
    id: 403,
    title: "Youth Academy Produces National Team Prospects",
    description:
      "A local academy has developed multiple young players who are now being scouted for national youth squads.",
    author: "Karan Joshi",
    date: "November 7, 2025",
    image: img2,
    url: "https://example.com/news/sports/403",
    likes: 21,
  },
  {
    id: 402,
    title: "Record-Breaking Performance at State Championships",
    description:
      "Several athletes set new state records in track and field events, marking a high-performance weekend for the sport.",
    author: "Meera Kapoor",
    date: "November 8, 2025",
    image: img1,
    url: "https://example.com/news/sports/402",
    likes: 8,
  },
  {
    id: 403,
    title: "Youth Academy Produces National Team Prospects",
    description:
      "A local academy has developed multiple young players who are now being scouted for national youth squads.",
    author: "Karan Joshi",
    date: "November 7, 2025",
    image: img2,
    url: "https://example.com/news/sports/403",
    likes: 21,
  },
  {
    id: 401,
    title: "National League: Semi-Final Upset Thrills Fans",
    description:
      "An underdog team secured a dramatic victory in the semi-final, setting up a highly anticipated final next week.",
    author: "Arjun Patel",
    date: "November 9, 2025",
    image: img4,
    url: "https://example.com/news/sports/401",
    likes: 2,
  },
  {
    id: 402,
    title: "Record-Breaking Performance at State Championships",
    description:
      "Several athletes set new state records in track and field events, marking a high-performance weekend for the sport.",
    author: "Meera Kapoor",
    date: "November 8, 2025",
    image: img1,
    url: "https://example.com/news/sports/402",
    likes: 8,
  },
  {
    id: 403,
    title: "Youth Academy Produces National Team Prospects",
    description:
      "A local academy has developed multiple young players who are now being scouted for national youth squads.",
    author: "Karan Joshi",
    date: "November 7, 2025",
    image: img2,
    url: "https://example.com/news/sports/403",
    likes: 21,
  },
];

const featured = {
  id: 302,
  title: "Startup Revolutionises Last-Mile Delivery",
  description:
    "A local startup has piloted an autonomous delivery network that reduces delivery times and cuts carbon emissions in dense cities.",
  author: "Rahul Desai",
  date: "November 9, 2025",
  image: img4,
  url: "https://example.com/news/trending/302",
  likes: 33,
};

// Map of category keys to their respective data arrays
const newsData: { [key: string]: NewsPost[] } = {
  national,
  world,
  trending,
  sports,
};

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen md:py-5">
      {/* Hero / Featured Section*/}
      <HeroCarousel posts={national} />
      <div className=" md:px-8 mx-4 md:mx-20">
        {/* Introduction Section (Styled) */}
        <section className="container mx-auto py-6">
          <blockquote className="border-l-4 border-red-500 pl-4 py-2 bg-white shadow-md rounded-md">
            <p className="text-gray-700 italic text-lg leading-relaxed">
              "The Eminent News (TEN) provides daily current affairs news for
              competitive exams like **UPSC, State Services** & more. Join us to
              **Learn, Leap & Lead** with quality content & better results."
            </p>
          </blockquote>
        </section>

        <hr className="my-4 border-t border-gray-200" />

        {/* Mobile Tabbed News Section (Consolidated Categories) */}
        <section className="block md:hidden container mx-auto">
          <div className="pb-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-red-500 inline-block pb-1">
              Explore Categories 📰
            </h2>
          </div>

          {/* Tabs Component */}
          <Tabs defaultValue={categories[0].key}>
            <TabsList className="gap-4 md:gap-8 w-full md:w-96">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.key}
                  value={category.key}
                  className="py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-colors duration-200 text-gray-700 font-semibold"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content for Each Category */}
            {categories.map((category) => (
              <TabsContent
                key={category.key}
                value={category.key}
                className="mt-6 p-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {newsData[category.key] ? (
                    newsData[category.key].map((news) => (
                      <Post key={news.id} news={news} />
                    ))
                  ) : (
                    <p className="col-span-4 text-center text-gray-500 p-10">
                      No posts found for this category.
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* desktop mode */}
        <section className="hidden md:flex flex-col gap-6 container mx-auto py-4">
          <div className="flex gap-10">
            <div className="w-3/4 space-y-12">
              {/* trending news section */}
              <div>
                <h3 className="bg-blue-500 py-2 px-3 text-xl text-white font-bold max-w-96 mb-2 rounded-lg flex items-center gap-2">
                  <Flame size={22} />
                  Trending News
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {trending.map((news) => (
                    <Post key={news.id} news={news} />
                  ))}
                </div>
              </div>

              {/* national news section */}
              <div>
                <h3 className="bg-green-500 py-2 px-3 text-xl text-white font-bold max-w-96 mb-2 rounded-lg flex items-center gap-2">
                  <Flag size={22} />
                  National News
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {national.map((news) => (
                    <Post key={news.id} news={news} />
                  ))}
                </div>
              </div>

              {/* world news section */}
              <div>
                <h3 className="bg-yellow-500 py-2 px-3 text-xl text-white font-bold max-w-96 mb-2 rounded-lg flex items-center gap-2">
                  <Globe2 size={22} />
                  World News
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {world.map((news) => (
                    <Post key={news.id} news={news} />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-1/4">
              <div className="mb-2">
                <h3 className="bg-black py-2 px-4 text-xl text-white font-bold rounded-full flex items-center gap-2">
                  <span className="text-2xl">⚡</span> Latest News
                </h3>
              </div>

              {featured && (
                <div className="mb-6">
                  <div className="relative rounded-md overflow-hidden">
                    <img
                      src={featured.image}
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
                {latestNews.map((item: NewsPost) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 border-b pb-3 last:border-none"
                  >
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                    </div>

                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-14 rounded object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* sports news section */}
          <div>
            <h3 className="bg-blue-500 py-2 px-3 text-xl text-white font-bold max-w-96 mb-2 rounded-lg flex items-center gap-2">
              <Trophy size={22} />
              Sports News
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sports.map((news) => (
                <Post key={news.id} news={news} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

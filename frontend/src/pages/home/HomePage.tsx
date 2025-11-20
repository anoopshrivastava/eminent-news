import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Post from '@/components/Post';
import img1 from '@/assets/N1.jpeg'
import img2 from '@/assets/s2.jpeg'
import img3 from '@/assets/t1.jpg'
import img4 from '@/assets/w1.jpeg'


// --- Data Types and Definitions (Unchanged) ---
export type NewsPost = {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  image: string; // Updated to use better dummy URLs
  url: string;
};

export const categories = [
  { key: 'national', label: 'National' },
  { key: 'world', label: 'World' },
  { key: 'trending', label: 'Trending' },
  { key: 'sports', label: 'Sports' },
];

// --- Improved Dummy Data with Better Image URLs (unsplash source) ---
// Using source.unsplash.com for more realistic placeholder images
const national: NewsPost[] = [
  {
    id: 101,
    title: 'Government Announces New Education Reform',
    description: 'The government unveiled a new policy focused on curriculum updates, teacher training and digital classrooms to improve learning outcomes across the country.',
    author: 'Vastvik Rao',
    date: 'November 13, 2025',
    image: img3,
    url: 'https://example.com/news/national/101',
  },
  {
    id: 102,
    title: 'Infrastructure Push: Major Highways Approved',
    description: 'Funding has been approved for several interstate highways and bridges to boost connectivity and reduce travel time between metropolitan centres.',
    author: 'Anita Sen',
    date: 'November 12, 2025',
    image: img1,
    url: 'https://example.com/news/national/102',
  },
  {
    id: 103,
    title: 'Healthcare Initiative Expands in Rural Areas',
    description: 'A new mobile health clinic program aims to deliver primary care services to remote and underserved villages, leveraging telemedicine for specialist consults.',
    author: 'Dr. Rohit Mehra',
    date: 'November 11, 2025',
    image: img2,
    url: 'https://example.com/news/national/103',
  },
];

const world: NewsPost[] = [
  {
    id: 201,
    title: 'Global Summit Focuses on Climate Finance',
    description: 'Leaders gather to discuss funding mechanisms for climate adaptation and mitigation in developing nations.',
    author: 'Liu Wei',
    date: 'November 12, 2025',
    image: img1,
    url: 'https://example.com/news/world/201',
  },
  {
    id: 202,
    title: 'Trade Talks Resume Between Major Economies',
    description: 'Negotiators from key trading partners have returned to the table to hammer out tariffs, supply chain rules and digital trade standards.',
    author: 'Emma Clarke',
    date: 'November 10, 2025',
    image: img4,
    url: 'https://example.com/news/world/202',
  },
];

const trending: NewsPost[] = [
  {
    id: 301,
    title: 'Study Shows Rise in Urban Green Spaces',
    description: 'Recent research highlights the benefits of green roofs, pocket parks and urban tree planting on mental health and air quality.',
    author: 'Priya Nair',
    date: 'November 10, 2025',
    image: img2,
    url: 'https://example.com/news/trending/301',
  },
  {
    id: 302,
    title: 'Startup Revolutionises Last-Mile Delivery',
    description: 'A local startup has piloted an autonomous delivery network that reduces delivery times and cuts carbon emissions in dense cities.',
    author: 'Rahul Desai',
    date: 'November 9, 2025',
    image: img4,
    url: 'https://example.com/news/trending/302',
  },
  {
    id: 303,
    title: 'Viral Challenge Promotes Community Cleanups',
    description: 'A viral social media challenge is encouraging communities to organise neighbourhood cleanups and share before-and-after stories online.',
    author: 'Sana K.',
    date: 'November 8, 2025',
    image: img3,
    url: 'https://example.com/news/trending/303',
  },
];

const sports: NewsPost[] = [
  {
    id: 401,
    title: 'National League: Semi-Final Upset Thrills Fans',
    description: 'An underdog team secured a dramatic victory in the semi-final, setting up a highly anticipated final next week.',
    author: 'Arjun Patel',
    date: 'November 9, 2025',
    image: img4,
    url: 'https://example.com/news/sports/401',
  },
  {
    id: 402,
    title: 'Record-Breaking Performance at State Championships',
    description: 'Several athletes set new state records in track and field events, marking a high-performance weekend for the sport.',
    author: 'Meera Kapoor',
    date: 'November 8, 2025',
    image: img1,
    url: 'https://example.com/news/sports/402',
  },
  {
    id: 403,
    title: 'Youth Academy Produces National Team Prospects',
    description: 'A local academy has developed multiple young players who are now being scouted for national youth squads.',
    author: 'Karan Joshi',
    date: 'November 7, 2025',
    image: img2,
    url: 'https://example.com/news/sports/403',
  },
];

// Map of category keys to their respective data arrays
const newsData: { [key: string]: NewsPost[] } = {
  national,
  world,
  trending,
  sports,
};


// --- Improved HomePage Component ---
const HomePage: React.FC = () => {
  const featuredPost = national[0] || { // Use one post as the featured story
    id: 999,
    title: 'Major Breakthrough: The Future of Renewable Energy',
    description: 'Scientists unveil a new high-efficiency solar technology promising to revolutionise global power generation. Read the full analysis.',
    author: 'Dr. Jane Smith',
    date: 'November 15, 2025',
    image: 'https://www.google.com/imgres?q=news%20image&imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-vector%2Fglobal-broadcast-breaking-news-banner-with-global-map_1017-59836.jpg%3Fsemt%3Dais_hybrid%26w%3D740%26q%3D80&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fbreaking-news&docid=Fvi8wcmNKPZKQM&tbnid=aTRYtw5WMn8MqM&vet=12ahUKEwjG94jRhYGRAxVKxTgGHX-cGRwQM3oECBQQAA..i&w=740&h=423&hcb=2&ved=2ahUKEwjG94jRhYGRAxVKxTgGHX-cGRwQM3oECBQQAA',
    url: 'https://example.com/featured/999',
  };

  return (
    <div className="min-h-screenp-4 pt-3 md:p-8">

      {/* Hero / Featured Section (Improved Layout & Styling) */}
      <section className="container mx-auto">
        <a 
          href={featuredPost.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block rounded-xl shadow-2xl hover:shadow-red-300 transition-all duration-300 overflow-hidden relative group"
        >
          {/* Main Image */}
          <img 
            src={featuredPost.image} 
            alt={featuredPost.title} 
            className="w-full h-64 md:h-[65vh] object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
          />
          {/* Overlay for Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
            <span className="text-sm font-medium text-red-400 uppercase tracking-widest mb-1">Featured Story</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              {featuredPost.title}
            </h1>
            <p className="text-white/80 mt-2 text-base md:text-lg hidden sm:block">
              {featuredPost.description}
            </p>
            <div className="mt-3 text-sm text-gray-300">
                <span>By {featuredPost.author}</span>
                <span className="mx-2">|</span>
                <span>{featuredPost.date}</span>
            </div>
          </div>
        </a>
      </section>

      {/* Introduction Section (Styled) */}
      <section className="container mx-auto py-6">
        <blockquote className="border-l-4 border-red-500 pl-4 py-2 bg-white shadow-md rounded-md">
          <p className="text-gray-700 italic text-lg leading-relaxed">
            "The Eminent News (TEN) provides daily current affairs news for competitive exams like **UPSC, State Services** & more. Join us to **Learn, Leap & Lead** with quality content & better results."
          </p>
        </blockquote>
      </section>

      <hr className="my-4 border-t border-gray-200" />

      {/* Tabbed News Section (Consolidated Categories) */}
      <section className="container mx-auto md:pb-8 md:pt-4">
        <div className='pb-6'>
          <h2 className='text-3xl font-bold text-gray-800 border-b-2 border-red-500 inline-block pb-1'>
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
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                {newsData[category.key] ? newsData[category.key].map((news) => (
                  <Post key={news.id} news={news} />
                )) : (
                  <p className="col-span-4 text-center text-gray-500 p-10">No posts found for this category.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

    </div>
  );
};

export default HomePage;
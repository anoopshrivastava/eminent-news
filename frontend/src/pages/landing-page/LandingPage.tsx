import React, { useEffect, useRef, useState } from "react";
import logo from '@/assets/logo.png'
import mobile from '@/assets/mobile.png'
import mobile1 from '@/assets/mobile1.png'
import mobile2 from '@/assets/mobile2.png'
import mobile3 from '@/assets/mobile3.png'
import appStore from '@/assets/appStore.png'
import playStore from '@/assets/playStore.png'
import award from '@/assets/award.png'
import award1 from '@/assets/award1.png'
import award2 from '@/assets/award2.png'
import award3 from '@/assets/award3.png'
import award4 from '@/assets/award4.png'
import award5 from '@/assets/award5.png'
import rating from '@/assets/rating.png'
import andLogo from '@/assets/andlogo.png'
import publisher from '@/assets/publisher.png'
import { Link } from "react-router-dom";
import Footer2 from "@/components/Footer2";

const LandingPage: React.FC = () => {
  // refs for the three slider sections
  const slider1Ref = useRef<HTMLDivElement | null>(null);
  const slider2Ref = useRef<HTMLDivElement | null>(null);
  const slider3Ref = useRef<HTMLDivElement | null>(null);

  // opacity state for smooth fade
  const [opacities, setOpacities] = useState<number[]>([1, 1, 1]);
  // active index for dot nav highlight
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    // IntersectionObserver to update opacity and active index
    const refs = [
      { ref: slider1Ref.current, idx: 0 },
      { ref: slider2Ref.current, idx: 1 },
      { ref: slider3Ref.current, idx: 2 },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // We'll compute opacities based on intersectionRatio (clamped)
        setOpacities((prev) => {
          const next = [...prev];
          entries.forEach((entry) => {
            const target = entry.target as HTMLDivElement;
            const idxAttr = target.dataset?.index;
            if (!idxAttr) return;
            const idx = Number(idxAttr);
            // clamp ratio between 0.15 and 1 for visible range
            const ratio = Math.max(0.15, Math.min(1, entry.intersectionRatio));
            next[idx] = Number(ratio.toFixed(2));
          });
          return next;
        });

        // Set active index to the section with largest intersectionRatio among observed entries
        let maxRatio = -1;
        let maxIdx = activeIndex;
        entries.forEach((entry) => {
          const target = entry.target as HTMLDivElement;
          const idxAttr = target.dataset?.index;
          if (!idxAttr) return;
          const idx = Number(idxAttr);
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxIdx = idx;
          }
        });
        if (maxIdx !== activeIndex) setActiveIndex(maxIdx);
      },
      {
        root: null,
        rootMargin: "0px",
        // thresholds to get smooth intersectionRatio changes
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    refs.forEach((r) => {
      if (r.ref) observer.observe(r.ref);
    });

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">

      {/* Top Navbar */}
      <header className="w-full max-w-7xl flex items-center justify-between py-6 px-6 md:px-28">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="ten logo" className="h-8" />
        </div>

        <nav className="flex space-x-8 text-gray-400 text-sm">
          <Link to="/home" className="hover:text-[#f40607] cursor-pointer hover:underline">Read Now</Link>
          <a className="hidden md:flex hover:text-[#f40607] cursor-pointer hover:underline">Blog</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center w-full max-w-7xl gap-12 px-6 md:px-40 mt-4 text-center md:text-left">

        {/* Left mobile mock */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-start">
          <img src={mobile} alt="News preview" className="w-[250px] md:w-[250px]" />
        </div>

        {/* Right text */}
        <div className="w-full md:w-3/5 flex flex-col items-center md:items-start">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-snug">
            Stay informed in <span className="text-blue-500">60 words.</span>
          </h1>

          <p className="text-gray-500 max-w-md text-base leading-relaxed">
            We understand you don’t have time to go through long news articles everyday.
            So we cut the clutter and deliver them in 60-word shorts.
          </p>

          <div className="flex gap-4 mt-8 justify-center md:justify-start">
            <a href="#"><img src={appStore} className="h-10" /></a>
            <a href="#"><img src={playStore} className="h-10" /></a>
          </div>
        </div>
      </section>

      {/* Award Section */}
      <section className="flex flex-col items-center w-full max-w-7xl gap-12 py-20 md:py-40 px-0">
        <h3 className="text-lg border-b border-red-300 text-[#f40607]">Awards</h3>
        <div className="bg-gray-100 w-full flex flex-col items-center py-8 px-4">
          <img src={award} alt="" className="w-52 md:w-auto" />
          <p className="font-bold text-lg text-black text-center mt-4">
            Best Innovative Mobile App of the year
          </p>
        </div>
      </section>

      {/* Slider 1 */}
      <section
        ref={slider1Ref}
        data-index="0"
        style={{
          opacity: opacities[0],
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
          transform: `translateY(${(1 - opacities[0]) * 12}px)`,
        }}
        className="flex flex-col md:flex-row items-center gap-10 md:gap-20 md:px-40 py-20 md:py-40 px-6 text-center md:text-left"
      >
        <div className="w-full">
          <div className="font-semibold text-xl text-[#f40607] mb-6">
            <h3>Your Personal App,</h3>
            <h3>Your Personalised Shorts.</h3>
          </div>
          <p className="max-w-80 text-gray-500 mx-auto md:mx-0">
            Our AI engine intuitively understands what you like reading.
          </p>
        </div>
        <img src={mobile1} alt="" className="w-60 md:w-64" />
      </section>

      {/* Slider 2 */}
      <section
        ref={slider2Ref}
        data-index="1"
        style={{
          opacity: opacities[1],
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
          transform: `translateY(${(1 - opacities[1]) * 12}px)`,
        }}
        className="flex flex-col md:flex-row items-center gap-10 md:gap-20 md:px-40 py-20 px-6 text-center md:text-left"
      >
        <div className="w-full">
          <div className="font-semibold text-xl text-[#f40607] mb-6">
            <h3>Explore an array of news</h3>
            <h3>categories, all in one place.</h3>
          </div>
          <p className="max-w-80 text-gray-500 mx-auto md:mx-0">
            Browse categories and see trending news instantly.
          </p>
        </div>
        <img src={mobile2} alt="" className="w-60 md:w-64" />
      </section>

      {/* Slider 3 */}
      <section
        ref={slider3Ref}
        data-index="2"
        style={{
          opacity: opacities[2],
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
          transform: `translateY(${(1 - opacities[2]) * 12}px)`,
        }}
        className="flex flex-col md:flex-row items-center gap-10 md:gap-20 md:px-40 py-20 px-6 text-center md:text-left"
      >
        <div className="w-full">
          <div className="font-semibold text-xl text-[#f40607] mb-6">
            <h3>Your favourite sources in</h3>
            <h3>one app TEN .</h3>
          </div>
          <p className="max-w-80 text-gray-500 mx-auto md:mx-0">
            We pick-up articles from all your favourite sources and present them in 60-word shorts. Read full articles for shorts that interest you, within the app.
          </p>
        </div>
        <img src={mobile3} alt="" className="w-60 md:w-60" />
      </section>

      {/* Featured In */}
      <section className="flex flex-col items-center w-full max-w-7xl gap-12 py-20 md:py-40 px-0">
        <h3 className="text-lg border-b border-red-300 text-[#f40607]">As Featured In</h3>
        <div className="bg-gray-100 w-full flex flex-wrap justify-center gap-8 md:gap-10 py-10 md:py-20 px-4">
          {[award1, award2, award3, award4, award5].map((img, i) => (
            // keep the same markup; only added a key which is fine
            // (original had same mapping)
            // small change: using i as key is safe for static list
            <img key={i} src={img} className="h-14 md:h-16" />
          ))}
        </div>
      </section>

      {/* Business Section */}
      <section className="flex flex-col items-center w-full max-w-7xl gap-12 pb-20 px-0">
        <h3 className="text-lg border-b border-red-300 text-[#f40607]">Best in the Business</h3>

        <div className="bg-gray-100 w-full flex flex-col md:flex-row justify-around items-center gap-10 py-14 px-4 md:px-20">

          <div className="flex flex-col items-center text-center max-w-xs">
            <img src={rating} />
            <h3 className="text-[#f40607] font-semibold mt-4">Loved by Users</h3>
            <p className="text-gray-500">Rating of 4.6 on Playstore</p>
          </div>
          
          <div className="flex flex-col items-center text-center max-w-xs">
            <img src={andLogo} />
            <h3 className="text-[#f40607] font-semibold mt-4">Loved by app stores</h3>
            <p className="text-gray-500">
              Featured by Apple & Google
            </p>
          </div>

          <div className="flex flex-col items-center text-center max-w-xs">
            <img src={publisher} />
            <h3 className="text-[#f40607] font-semibold mt-4">Loved by publishers</h3>
            <p className="text-gray-500">
              30+ global content partners
            </p>
          </div>
        </div>
      </section>

      {/* Final Download */}
      <section className="flex flex-col items-center w-full max-w-7xl gap-6 pb-20 md:pb-28 px-4 text-center">
        <h3 className="text-lg font-bold text-gray-600">Download the easiest way to stay informed</h3>
        <div className="flex gap-4 justify-center">
          <a href="#"><img src={appStore} className="h-10" /></a>
          <a href="#"><img src={playStore} className="h-10" /></a>
        </div>
      </section>

      <Footer2 />
    </div>
  );
};

export default LandingPage;

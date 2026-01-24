import React, { useEffect, useRef, useState } from "react";
import logo from "@/assets/TEN-TM-LOGO (1).png";
// import mobile from "@/assets/landing-page/1.png";
import img1 from "@/assets/img1.jpeg";
import mobile1 from "@/assets/landing-page/2.png";
import mobile2 from "@/assets/landing-page/3.png";
import mobile3 from "@/assets/landing-page/4.png";
import laptop1 from "@/assets/landing-page/8.png";
import laptop2 from "@/assets/landing-page/9.png";
import laptop3 from "@/assets/landing-page/10.png";
import contactUs from "@/assets/landing-page/contactUs4.avif";
import appStore from "@/assets/appStore.png";
import playStore from "@/assets/playStore.png";
import rating from "@/assets/rating.png";
import andLogo from "@/assets/andlogo.png";
import publisher from "@/assets/publisher.png";
import { Link } from "react-router-dom";
import Footer2 from "@/components/Footer2";
import { Mail, MapPin } from "lucide-react";

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
      <header className="w-full flex items-center justify-between py-4 px-6 md:px-28 shadow-md sticky top-0 bg-white z-40">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="ten logo" className="h-8" />
        </div>

        <nav className="flex space-x-8 text-gray-400 text-sm">
          <Link
            to="/home"
            className="hover:text-[#f40607] cursor-pointer hover:underline"
          >
            Read Now
          </Link>
          {/* <a className="hidden md:flex hover:text-[#f40607] cursor-pointer hover:underline">Blog</a> */}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="flex flex-col md:flex-row items-center w-full max-w-7xl gap-2 md:gap-12 px-6 md:px-40 text-center md:text-left">
          {/* Left mobile mock */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-start py-10 md:py-20 md:px-10 ">
            <img
              src={img1}
              alt="News preview"
              className="w-[370px] md:w-320 rounded-md"
            />
          </div>

          {/* Right text */}
          <div className="w-full md:w-3/5 flex flex-col items-center md:items-start">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              Learn, Leap and Lead in Life along with -{" "}
              <span className="text-[#f40607]">The Eminent News </span>
            </h1>

            <p className="text-gray-600 max-w-lg text-base leading-relaxed">
              We Provide almost 100% accurate news for everyone Especially Youth
              Aspirants of world.
            </p>

            <div className="flex gap-4 mt-8 justify-center md:justify-start">
              <a href="#">
                <img src={appStore} className="h-10" />
              </a>
              <a href="#">
                <img src={playStore} className="h-10" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Award Section */}
      {/* <section className="flex flex-col items-center w-full max-w-7xl gap-12 py-20 md:py-40 px-0">
        <h3 className="text-2xl border-b border-red-300 text-[#f40607]">
          Awards
        </h3>
        <div className="bg-gray-100 w-full flex flex-col items-center py-8 px-4">
          <img src={award} alt="" className="w-52 md:w-auto" />
          <p className="font-bold text-lg text-black text-center mt-4">
            Best Innovative Mobile App of the year
          </p>
        </div>
      </section> */}

      {/* Slider 1 */}
      <section
        ref={slider1Ref}
        data-index="0"
        style={{
          opacity: opacities[0],
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
          transform: `translateY(${(1 - opacities[0]) * 12}px)`,
        }}
        className="flex flex-col md:flex-row items-center gap-10 md:gap-20 md:px-40 py-10 md:py-40 px-6 text-center md:text-left"
      >
        <div className="w-full">
          <div className="font-semibold text-2xl text-[#f40607] mb-6">
            <h3>Your Personal App,</h3>
            <h3>Your Personalised Shorts.</h3>
          </div>
          <p className="max-w-96 text-lg text-gray-500 mx-auto md:mx-0">
            Our AI engine intuitively understands what you like reading.
          </p>
        </div>
        <img src={mobile1} alt="" className="w-60 md:w-64" />
      </section>

      <div className="md:hidden px-4 pb-4 text-center text-lg text-gray-500"> We welcome all UPSC , StatePcs ,SSC ,CGL , CDS, NDA, banking sectors etc Aspirants to join us to Learn ,leap and lead in Life</div>

      {/* Slider 2 */}
      <section
        ref={slider2Ref}
        data-index="1"
        style={{
          opacity: opacities[1],
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
          transform: `translateY(${(1 - opacities[1]) * 12}px)`,
        }}
        className="flex flex-col md:flex-row items-center gap-10 md:gap-20 md:px-40 md:py-20 px-6 text-center md:text-left"
      >
        <img src={mobile2} alt="" className="w-60 md:w-64" />

        <div className="w-full">
          <div className="font-semibold text-2xl text-[#f40607] mb-6">
            <h3>Explore an array of news</h3>
            <h3>categories, all in one place.</h3>
          </div>
          <p className="max-w-96 text-lg text-gray-500 mx-auto md:mx-0">
            Browse categories and see trending news instantly.
          </p>
        </div>
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
        className="flex flex-col md:flex-row items-center gap-10 md:gap-20 md:px-40 py-10 md:py-20 px-6 text-center md:text-left"
      >
        <div className="w-full">
          <div className="font-semibold text-2xl text-[#f40607] mb-6">
            <h3>Your favourite sources in</h3>
            <h3>one app TEN .</h3>
          </div>
          <p className="max-w-96 text-lg text-gray-500 mx-auto md:mx-0">
             Read accurate and detailed analysis of news , done by eminent one with Post, image ,shorts and Video to make you valuable one with right knowledge at right plateform.
          </p>
        </div>
        <img src={mobile3} alt="" className="w-60 md:w-60" />
      </section>

      {/* Featured In */}
      {/* <section className="flex flex-col items-center w-full max-w-7xl gap-12 py-20 md:py-40 px-0">
        <h3 className="text-2xl border-b border-red-300 text-[#f40607]">
          As Featured In
        </h3>
        <div className="bg-gray-100 w-full flex flex-wrap justify-center gap-8 md:gap-10 py-10 md:py-20 px-4">
          {[award1, award2, award3, award4, award5].map((img, i) => (
            // keep the same markup; only added a key which is fine
            // (original had same mapping)
            // small change: using i as key is safe for static list
            <img key={i} src={img} className="h-14 md:h-16" />
          ))}
        </div>
      </section> */}

      {/* Featured In */}
      <section className="flex flex-col items-center w-full max-w-7xl gap-12 py-10 md:pt-2 md:pb-40 px-0">
        <div className="mx-4 text-center">
          <h3 className="text-2xl border-b border-red-300 text-[#f40607] text-center">
            Shorts, Videos & Detail News
          </h3>
          <span className="text-gray-500 text-center">
            Access to vast News with detail infromation, along with Shorts and
            Videos.
          </span>
        </div>
        <div className="bg-gray-100 w-full flex flex-wrap justify-center gap-8 md:gap-10 py-10 md:py-20 px-4">
          {[laptop1, laptop2, laptop3].map((img, i) => (
            <img key={i} src={img} className="h-14 md:h-64" />
          ))}
        </div>
      </section>

      {/* Business Section */}
      <section className="flex flex-col items-center w-full max-w-7xl gap-12 pb-20 px-0">
        <h3 className="text-2xl border-b border-red-300 text-[#f40607]">
          Best in the Business
        </h3>

        <div className="bg-gray-100 w-full flex flex-col md:flex-row justify-around items-center gap-10 py-14 px-4 md:px-20">
          <div className="flex flex-col items-center text-center max-w-xs">
            <img src={rating} />
            <h3 className="text-[#f40607] font-semibold mt-4">
              Loved by Users
            </h3>
            <p className="text-gray-500">Rating of 4.6 on Playstore</p>
          </div>

          <div className="flex flex-col items-center text-center max-w-xs">
            <img src={andLogo} />
            <h3 className="text-[#f40607] font-semibold mt-4">
              Loved by app stores
            </h3>
            <p className="text-gray-500">Featured by Apple & Google</p>
          </div>

          <div className="flex flex-col items-center text-center max-w-xs">
            <img src={publisher} />
            <h3 className="text-[#f40607] font-semibold mt-4">
              Loved by publishers
            </h3>
            <p className="text-gray-500">30+ global content partners</p>
          </div>
        </div>
      </section>

      {/* Contact Us Section (NEW) */}
      <section className="w-full max-w-7xl px-6 md:px-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20 items-center">
          {/* Left: Contact Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src={contactUs}
              alt="contact us"
              className="w-full md:w-[420px] object-cover"
            />
          </div>

          {/* Right: Contact Info */}
          <div className="bg-white md:p-8">
            <h3 className="text-3xl font-bold text-[#f40607] mb-4 text-center">
              Contact Us
            </h3>
            <p className="text-gray-600 mb-6">
              Have feedback or want to partner with us? We'd love to hear from
              you. Reach out using any of the options below.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <a
                    href="mailto:contact@eminentnews.com"
                    className="text-gray-800 font-medium"
                  >
                    contact@eminentnews.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail />
                <div>
                  <div className="text-sm text-gray-500">Email 2</div>
                  <a
                    href="mailto:support@eminentnews.com"
                    className="text-gray-800 font-medium"
                  >
                    support@eminentnews.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="text-gray-800 font-medium">
                    Gorakhpur, UP, India 273413
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Download */}
      <section className="flex flex-col items-center w-full max-w-7xl gap-6 pb-20 pt-8 md:pb-28 px-4 text-center">
        <h3 className="text-lg font-bold text-gray-600">
          Download the easiest way to stay informed
        </h3>
        <div className="flex gap-4 justify-center">
          <a href="#">
            <img src={appStore} className="h-10" />
          </a>
          <a href="#">
            <img src={playStore} className="h-10" />
          </a>
        </div>
      </section>

      <Footer2 />
    </div>
  );
};

export default LandingPage;

{
  /* <img src={support} alt="" className="h-52 w-52" /> */
}

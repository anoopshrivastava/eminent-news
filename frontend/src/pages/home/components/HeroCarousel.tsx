import type { News } from "@/types/news";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  posts: News[]; // expects at least 1 post, will show up to 3 (first 3)
  intervalMs?: number; // autoplay interval in milliseconds (default 5000)
};

export default function HeroCarousel({ posts, intervalMs = 5000 }: Props) {
  const slides = (posts || []).slice(0, 3);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return;

    // clear previous
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    if (!isPaused) {
      intervalRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, intervalMs) as unknown as number;
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isPaused, slides.length, intervalMs]);

  // Pause autoplay on unmount / safety
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  // Keyboard navigation when focus on container
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + slides.length) % slides.length);
    if (e.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length);
  }

  if (!slides.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
    >
      {/* slides wrapper */}
      <div
        className={`flex w-full transition-transform duration-700 ease-in-out`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((post) => (
          <a
            key={post._id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full shrink-0 relative block"
          >
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-64 md:h-[64vh] object-cover object-top"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent p-6 flex flex-col justify-end">
              <span className="text-xs uppercase tracking-widest text-red-400">Featured</span>
              <h3 className="text-xl md:text-3xl font-extrabold text-white leading-tight mt-1">
                {post.title}
              </h3>
              <p className="hidden sm:block text-white/80 mt-2 text-sm md:text-base">
                {post.description}
              </p>
              <div className="mt-3 text-sm text-gray-200">
                <span>By {post.editor?.name}</span>
                <span className="mx-2">|</span>
                <span>{post.createdAt}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Prev / Next buttons */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 p-2 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 p-2 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full focus:outline-none transition-all ${i === index ? "scale-110 bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

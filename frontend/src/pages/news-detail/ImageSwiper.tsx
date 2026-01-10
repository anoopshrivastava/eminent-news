import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

export const ImageSwiper = ({ images }: { images: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    if (activeIndex === 0) return;
    scrollToIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex === images.length - 1) return;
    scrollToIndex(activeIndex + 1);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const index = Math.round(containerRef.current.scrollLeft / width);
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Images */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="
          flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {images.map((img, idx) => (
          <div key={idx} className="min-w-full snap-center flex-shrink-0">
            <img
              src={img}
              alt={`News image ${idx + 1}`}
              className="w-full h-[240px] sm:h-[320px] md:h-[420px] object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      {activeIndex > 0 && (
        <button
          onClick={handlePrev}
          className=" absolute -left-3 md:left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full flex "
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Right Arrow */}
      {activeIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="
            absolute -right-3 md:right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full flex"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full transition ${activeIndex === i ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

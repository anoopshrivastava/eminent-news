import React, { useEffect, useState, useRef, useCallback } from "react";
import type { Ads } from "@/types/ads";

export const HighlightImageSlider: React.FC<{ ads: Ads[] }> = ({ ads }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!ads || ads.length <= 1) return;
    const t = setInterval(() => setIdx((s) => (s + 1) % ads.length), 5000);
    return () => clearInterval(t);
  }, [ads]);

  if (!ads || ads.length === 0) return null;

  const current = ads[idx];

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-sm mb-6">
      <a href={current.url || "#"} target="_blank" rel="noopener noreferrer">
        <img
          src={current.images?.[0]}
          alt={current.title || "Sponsored"}
          className="w-full h-56 md:h-72 object-cover"
        />
      </a>

      {/* Dots */}
      {ads.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === idx ? "bg-black scale-110" : "bg-black/50"
              }`}
            />
          ))}
        </div>
      )}

      {current.title && (
        <div className="p-2 text-sm font-medium text-gray-800">
          {current.title}
        </div>
      )}
    </div>
  );
};


export const VideoAdSlider: React.FC<{ ads: Ads[] }> = ({ ads }) => {
  const [index, setIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (!ads || ads.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((s) => (s + 1) % ads.length);
      setIsMuted(true);
    }, 7000);
    return () => clearInterval(interval);
  }, [ads]);

  const playCurrent = useCallback(async () => {
    const v = videoRef.current;
    if (!v || !visibleRef.current) return;
    try {
      v.muted = isMuted;
      await v.play().catch(() => {});
    } catch {}
  }, [isMuted]);

  useEffect(() => {
    playCurrent();
  }, [index, isMuted, playCurrent]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) playCurrent();
          else videoRef.current?.pause();
        });
      },
      { threshold: 0.5 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [playCurrent]);

  if (!ads || ads.length === 0) return null;
  const ad = ads[index];

  return (
    <div ref={containerRef} className="w-full my-6 rounded-lg overflow-hidden border">
      <div className="relative w-full aspect-video bg-black">
        <video
          ref={videoRef}
          key={ad._id}
          src={ad.video?.url}
          playsInline
          muted={isMuted}
          loop
          className="w-full h-full object-contain"
        />

        <div className="absolute left-2 top-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Sponsored
        </div>

        <button
          onClick={() => {
            setIsMuted((m) => !m);
            const v = videoRef.current;
            if (v) {
              v.muted = !v.muted;
              void v.play().catch(() => {});
            }
          }}
          className="absolute right-2 bottom-2 z-20 bg-white/90 text-black text-sm px-3 py-1 rounded shadow"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>

      {/* Dots */}
      {ads.length > 1 && (
        <div className="flex justify-center gap-2 py-3">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setIsMuted(true);
              }}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-[#f40607]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {ad.title && (
        <div className="px-2 pb-2 text-sm font-medium text-gray-800">
          {ad.title}
        </div>
      )}
    </div>
  );
};

import { useState } from "react";

export default function SwipeButton({ onSuccess }: { onSuccess: () => void }) {
  const [swiped, setSwiped] = useState(false);

  const handleSwipe = () => {
    setSwiped(true);
    onSuccess();
  };

  return (
    <div className="relative w-full max-w-44 h-8 bg-gray-200 rounded-full  overflow-hidden">
      <div
        onClick={handleSwipe}
        className={`cursor-pointer w-24 text-center rounded-full p-1 text-white font-semibold transition-all
          ${swiped ? "bg-green-500 translate-x-full" : "bg-blue-500"}
        `}
        style={{ transition: "transform 0.5s ease" }}
      >
        {swiped ? "Done!" : "Swipe →"}
      </div>
    </div>
  );
}

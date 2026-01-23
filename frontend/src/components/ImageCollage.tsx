export const ImageCollage = ({ images, title }: { images: string[]; title: string }) => {
  if (!images || images.length === 0) {
    return (
      <img
        src="/placeholder.png"
        alt="placeholder"
        className="w-full md:h-48 md:w-80 object-cover rounded-md px-2"
      />
    );
  }

  // Single image
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={title}
        className="w-full md:h-48 md:w-80 object-cover rounded-md"
      />
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full md:h-48 md:w-80 rounded-md overflow-hidden">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={title}
            className="h-full w-full object-cover"
          />
        ))}
      </div>
    );
  }

  const displayImages = images.slice(0, 4);
  const remaining = images.length - 4;

  return (
    <div className="relative grid grid-cols-2 grid-rows-2 gap-1 w-full md:h-48 md:w-80 rounded-md overflow-hidden">
      {displayImages.map((img, idx) => (
        <div key={idx} className="relative">
          <img
            src={img}
            alt={title}
            className="h-full w-full object-cover"
          />

          {/* Overlay for extra images */}
          {idx === 3 && remaining > 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                +{remaining}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

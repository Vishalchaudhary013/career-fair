import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, PlayCircle } from "lucide-react";

const getEmbedUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0`;
  return null;
};

const downloadMedia = (e, url) => {
  e.preventDefault();
  e.stopPropagation();
  if (!url) return;
  
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = url.substring(url.lastIndexOf('/') + 1) || "download";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    })
    .catch(() => {
      const a = document.createElement("a");
      a.href = url;
      a.download = url.substring(url.lastIndexOf('/') + 1) || "download";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
};

const ImageCarousel = ({ images }) => {
   const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);
  

  return (
    <div className="relative h-[250px] md:h-[740px] w-full overflow-hidden shadow-sm group bg-black">
      
      

      {images.map((item, i) => {
        const isVideo = item.type === "video";
        const embedUrl = isVideo ? getEmbedUrl(item.url) : null;

        return (
          <div key={i} className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${i === current ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"}`}>
            {isVideo ? (
              embedUrl ? (
                <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              ) : (
                <video src={item.url} controls className="w-full h-full object-contain bg-black" />
              )
            ) : (
              <img src={item.url || item} alt="" className="w-full h-full object-fit" />
            )}
          </div>
        );
      })}
      
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100 cursor-pointer" aria-label="Previous">
            <ChevronLeft size={22} className="text-primary" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100 cursor-pointer" aria-label="Next">
            <ChevronRight size={22} className="text-primary" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-colors shadow-sm cursor-pointer ${i === current ? "bg-white" : "bg-white/50"}`} aria-label={`Go to image ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MediaRenderer = ({ item }) => {
  const isVideo = item.type === "video";
  const srcUrl = item.url || item;
  const embedUrl = isVideo ? getEmbedUrl(srcUrl) : null;

  return (
    <div className="w-full h-full relative bg-black group/media overflow-hidden">
      
      {/* <div className="absolute top-4 right-4 z-20 flex gap-3 opacity-0 group-hover/media:opacity-100 transition-opacity duration-300 pointer-events-auto">
        {isVideo && (
          <a 
            href={srcUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
          >
            <PlayCircle size={14} /> See Video
          </a>
        )}
        <button 
          onClick={(e) => downloadMedia(e, srcUrl)}
          className="flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
        >
          <Download size={14} /> Download
        </button>
      </div> */}

      {isVideo ? (
        embedUrl ? (
          <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        ) : (
          <video src={srcUrl} controls className="w-full h-full object-cover bg-black" />
        )
      ) : (
        <img src={srcUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
      )}
    </div>
  );
};

const EventGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  const firstVideo = images.find(item => item.type === "video");
  const hasVideo = !!firstVideo;
  const videoUrl = firstVideo?.url || firstVideo;

  const mainImage = images[0];
  const mainImageUrl = mainImage?.url || mainImage;

  return (
    <div className="flex flex-col gap-4">
      {images.length === 5 ? (
        <>
          <div className="hidden md:grid h-[450px] grid-cols-6 gap-0 md:gap-1 overflow-hidden">
            <div className="group col-span-3 h-full overflow-hidden"><MediaRenderer item={images[0]} /></div>
            <div className="group col-span-1 h-full overflow-hidden"><MediaRenderer item={images[1]} /></div>
            <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-0 md:gap-1 h-full min-h-0">
              {images.slice(2).map((item, i) => (
                <div key={i} className={`group h-full overflow-hidden ${i === 2 ? "col-span-2" : ""}`}>
                  <MediaRenderer item={item} />
                </div>
              ))}
            </div>
          </div>
          <div className="block md:hidden">
            <ImageCarousel images={images} />
          </div>
        </>
      ) : (
        <ImageCarousel images={images} />
      )}

      
      {/* <div className="flex justify-end gap-3">
        {hasVideo && (
          <a 
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2 rounded-4xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <PlayCircle size={18} /> Watch Video
          </a>
        )}
        <button 
          onClick={(e) => downloadMedia(e, mainImageUrl)}
          className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary/5 px-5 py-2 rounded-4xl text-sm font-semibold transition-all cursor-pointer"
        >
          <Download size={18} /> Download
        </button>
      </div> */}
    </div>
  );
};

export { ImageCarousel };
export default EventGallery;

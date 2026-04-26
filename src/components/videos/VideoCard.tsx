import { useState } from "react";
import { Play, Clock, X } from "lucide-react";
import { Video } from "../../lib/types";

interface Props {
  video: Video;
}

function getYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
  );
  return match ? match[1] : null;
}

function getVimeoId(url: string) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function getThumbnail(video: Video) {
  if (video.thumbnail) return video.thumbnail;
  if (video.video_type === "youtube") {
    const id = getYouTubeId(video.video_url);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800";
}

function getEmbedUrl(video: Video) {
  if (video.video_type === "youtube") {
    const id = getYouTubeId(video.video_url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
  }
  if (video.video_type === "vimeo") {
    const id = getVimeoId(video.video_url);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  return null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function VideoCard({ video }: Props) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = getThumbnail(video);
  const embedUrl = getEmbedUrl(video);

  return (
    <div className="glass-card rounded-xl overflow-hidden card-hover group flex flex-col h-[360px] w-full">
      <div className="relative flex-shrink-0">
        {playing ? (
          <div className="relative">
            {video.video_type === "upload" ? (
              <div className="video-embed h-48">
                <video className="w-full h-full object-cover" src={video.video_url} controls autoPlay />
              </div>
            ) : embedUrl ? (
              <div className="video-embed h-48">
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setPlaying(true)}
            className="relative h-48 overflow-hidden cursor-pointer"
          >
            <img
              src={thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center backdrop-blur-sm group-hover:bg-amber-500/30 group-hover:scale-110 transition-all duration-300 animate-pulse-gold">
                <Play
                  size={20}
                  className="text-amber-300 ml-1"
                  fill="currentColor"
                />
              </div>
            </div>
            {video.duration && (
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                <Clock size={10} />
                {video.duration}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-sm leading-snug mb-1.5 group-hover:text-amber-300 transition-colors duration-200 line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-2 flex-1">
            {video.description}
          </p>
        )}
        <p className="text-slate-500 text-xs mt-auto">
          {formatDate(video.created_at)}
        </p>
      </div>
    </div>
  );
}

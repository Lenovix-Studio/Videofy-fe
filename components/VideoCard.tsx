import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  video: Video;
  priority?: boolean;
}

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  createdAt: string;
}

const formatDurationFromSeconds = (totalSecondsStr: string | number) => {
  const totalSeconds = Number(totalSecondsStr) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${paddedSeconds}`;
};

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
function getFullMediaUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function VideoCardBase({ video, priority = false }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const thumbnailSrc = getFullMediaUrl(video.thumbnailUrl);
  const videoSrc = getFullMediaUrl(video.videoUrl);

  const startVideoPreview = () => {
    const videoElem = videoRef.current;
    if (!videoElem) return;

    videoElem.currentTime = 2;
    videoElem.play().catch(() => {});

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!videoElem || isNaN(videoElem.duration)) return;

      if (videoElem.currentTime + 10 >= videoElem.duration) {
        videoElem.currentTime = 2;
      } else {
        videoElem.currentTime += 8;
      }
    }, 800);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    startVideoPreview();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card className="group overflow-hidden border-none bg-transparent shadow-none pt-0">
      <Link href={`/watch/${video.id}`} className="block">
        <CardContent className="p-0">
          <div
            className="relative aspect-video overflow-hidden rounded-xl bg-muted"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={thumbnailSrc || "/placeholder.jpg"}
              alt={video.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
              loading={priority ? "eager" : "lazy"}
              {...(priority && { fetchPriority: "high" })}
            />

            <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white m-1 z-10">
              {formatDurationFromSeconds(video.duration)}
            </span>

            {/* Video Preview */}
            {videoSrc && (
              <video
                ref={videoRef}
                src={videoSrc}
                muted
                playsInline
                preload="metadata"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            {/* Play Overlay */}
            {!isHovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-primary/90 text-primary-foreground opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="mt-3 flex gap-3 px-1">
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-1 text-sm font-semibold leading-5 transition group-hover:text-primary">
                {video.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(video.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export const VideoCard = React.memo(VideoCardBase, (prevProps, nextProps) => {
  return (
    prevProps.video.id === nextProps.video.id &&
    prevProps.priority === nextProps.priority
  );
});

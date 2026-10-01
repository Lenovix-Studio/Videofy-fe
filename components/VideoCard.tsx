import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/constant";

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
  favorites?: any;
  tags?: VideoTagRelation[];
}

interface VideoTagRelation {
  tag: Tag;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
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

function getFullMediaUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function VideoCardBase({ video, priority = false }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(!!video.favorites);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingFav) return;

    setIsLoadingFav(true);
    setIsFavorite(!isFavorite);

    try {
      const res = await fetch(`${BACKEND_URL}/favorites/${video.id}/favorite`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Gagal mengubah status favorit");

      const data = await res.json();
      setIsFavorite(data.isFavorite);

      if (data.isFavorite) {
        toast.success("Ditambahkan ke favorit");
      } else {
        toast.success("Dihapus dari favorit");
      }
    } catch (err: any) {
      toast.error(err.message);
      setIsFavorite(isFavorite);
    } finally {
      setIsLoadingFav(false);
    }
  };

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

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className={`h-7 w-7 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-colors ${isFavorite ? "text-red-500" : "text-white"}`}
                onClick={toggleFavorite}
                disabled={isLoadingFav}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            {/* Badge Tag Pertama */}
            {video.tags && video.tags.length > 0 && (
              <span className="absolute top-2 left-2 rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white z-10 border border-white/10">
                {video.tags[0].tag.name}
              </span>
            )}

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

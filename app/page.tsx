"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Home, Heart, Tags, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  createdAt: string;
}

interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Fetch API
  const fetchVideos = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/videos?page=${pageNum}&limit=12`,
      );
      if (!response.ok) throw new Error("Gagal mengambil data video");

      const result = await response.json();
      const newVideos: Video[] = result.data;
      const meta: Meta = result.meta;

      setVideos((prev) =>
        pageNum === 1 ? newVideos : [...prev, ...newVideos],
      );
      setHasNextPage(meta.hasNextPage);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos(1);
  }, [fetchVideos]);

  // Trigger infinite scroll
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchVideos(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, isLoading, fetchVideos]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="flex pt-16">
        <Sidebar />

        <main className="w-full lg:ml-52">
          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
            {isInitialLoading ? (
              <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VideoCardSkeleton key={i} />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <p className="text-lg font-medium">
                  Belum ada video yang diunggah.
                </p>
              </div>
            ) : (
              <>
                {/* Video Grid */}
                <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>

                <div
                  ref={observerTarget}
                  className="py-8 flex justify-center items-center"
                >
                  {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>Memuat video lainnya...</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur lg:hidden">
        <nav className="flex h-16 items-center justify-around">
          <MobileNavItem
            icon={<Home className="h-5 w-5" />}
            label="Home"
            active
          />
          <MobileNavItem
            icon={<Heart className="h-5 w-5" />}
            label="Favorites"
          />
          <MobileNavItem icon={<Tags className="h-5 w-5" />} label="Tags" />
        </nav>
      </div>
    </div>
  );
}

function MobileNavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex h-auto flex-col items-center gap-1 p-2 ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Button>
  );
}

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
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function VideoCard({ video }: { video: Video }) {
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
            {/* Image Thumbnail */}
            <img
              src={thumbnailSrc}
              alt={video.title}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            />

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

function VideoCardSkeleton() {
  return (
    <Card className="overflow-hidden border-none bg-transparent shadow-none animate-pulse">
      <CardContent className="p-0">
        <div className="aspect-video w-full rounded-xl bg-muted" />
        <div className="mt-3 px-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}

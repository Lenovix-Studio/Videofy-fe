"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Home, Heart, Tags, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { VideoCard } from "@/components/VideoCard";
import { toast } from "sonner";

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
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

      setVideos((prev) => {
        if (pageNum === 1) return newVideos;

        const existingIds = new Set(prev.map((video) => video.id));
        const uniqueNewVideos = newVideos.filter(
          (video) => !existingIds.has(video.id),
        );

        return [...prev, ...uniqueNewVideos];
      });

      setHasNextPage(meta.hasNextPage);
    } catch (error: any) {
      toast.error("Fetch Error: " + (error.message || error));
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
      { threshold: 0.1 },
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
                  {videos.map((video, index) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      priority={index < 3}
                    />
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

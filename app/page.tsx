"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Search } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { VideoCard } from "@/components/VideoCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch API Get All video
  const fetchVideos = useCallback(async (pageNum: number, search: string) => {
    setIsLoading(true);
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await fetch(
        `${API_BASE_URL}/videos?page=${pageNum}&limit=12${searchParam}`,
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
    setPage(1);
    fetchVideos(1, debouncedQuery);
  }, [debouncedQuery, fetchVideos]);

  // Trigger infinite scroll
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchVideos(nextPage, debouncedQuery);
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
  }, [hasNextPage, isLoading, debouncedQuery, fetchVideos]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        center={
          <div className="flex max-w-2xl flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="h-10 w-full rounded-full bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-1"
              />
            </div>
          </div>
        }
      />
      <Sidebar />

      <div className="flex pt-16">
        <main className="w-full lg:ml-52">
          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
            {isInitialLoading ? (
              <div className="flex min-h-[80vh] w-full items-center justify-center col-span-full">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
              </div>
            ) : videos.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <p className="text-lg font-medium">
                  {searchQuery
                    ? `Tidak ada video dengan kata kunci "${searchQuery}".`
                    : "Belum ada video yang diunggah."}
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
    </div>
  );
}

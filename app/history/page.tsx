"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Play, Trash2, Search, Clock, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HistoryVideo {
  id: string;
  historyId: string;
  title: string;
  thumbnail: string;
  duration: string;
  watchedAt: string;
}

interface HistoryGroup {
  group: string;
  videos: HistoryVideo[];
}

interface Meta {
  totalVideos: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export default function HistoryPage() {
  const [historyGroups, setHistoryGroups] = useState<HistoryGroup[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Fetch data history dari NestJS API
  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/history`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data history");
      }

      const data = await res.json();
      setHistoryGroups(data.historyGroups || []);
      setMeta(data.meta || null);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle hapus item riwayat tontonan
  const handleRemoveHistory = async (videoId: string) => {
    setHistoryGroups((prevGroups) =>
      prevGroups
        .map((group) => ({
          ...group,
          videos: group.videos.filter((v) => v.id !== videoId),
        }))
        .filter((group) => group.videos.length > 0),
    );

    setMeta((prevMeta) => {
      if (!prevMeta) return null;
      return {
        ...prevMeta,
        totalVideos: Math.max(0, prevMeta.totalVideos - 1),
      };
    });

    try {
      const res = await fetch(`${API_BASE_URL}/history/video/${videoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchHistory();
      }
    } catch (error) {
      console.error("Error deleting history:", error);
      fetchHistory();
    }
  };

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
                placeholder="Cari di riwayat tontonan..."
                className="h-10 w-full rounded-full bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-1"
              />
            </div>
          </div>
        }
      />
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:pl-52 pt-20 pb-12 px-4 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          {isLoading ? (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Memuat riwayat tontonan...</p>
            </div>
          ) : (meta?.totalVideos ?? 0) > 0 ? (
            <div className="space-y-8">
              {historyGroups.map((group) => {
                const filteredVideos = group.videos.filter((video) =>
                  video.title.toLowerCase().includes(searchQuery.toLowerCase()),
                );

                if (filteredVideos.length === 0) return null;

                return (
                  <div key={group.group} className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground/90 border-b pb-1">
                      {group.group}
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredVideos.map((video) => (
                        <Card
                          key={video.historyId}
                          className="group overflow-hidden border-none bg-transparent shadow-none pt-0"
                        >
                          <CardContent className="p-0 space-y-3">
                            {/* Thumbnail */}
                            <Link
                              href={`/watch/${video.id}`}
                              className="block relative"
                            >
                              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                                <img
                                  src={
                                    video.thumbnail.startsWith("http")
                                      ? video.thumbnail
                                      : `http://localhost:3001${video.thumbnail}`
                                  }
                                  alt={video.title}
                                  className="h-full w-full object-cover"
                                />

                                {/* Play Hover Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                                  <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                                  </div>
                                </div>

                                {/* Tombol Hapus */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveHistory(video.historyId);
                                  }}
                                  title="Hapus dari Riwayat"
                                  className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                                {/* Duration Badge */}
                                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                                  {video.duration}
                                </span>
                              </div>
                            </Link>

                            {/* Meta Info */}
                            <div className="flex items-start justify-between gap-2 px-1">
                              <div className="min-w-0 flex-1 space-y-1">
                                <Link href={`/watch/${video.id}`}>
                                  <h3 className="line-clamp-1 text-sm font-semibold leading-snug transition group-hover:text-primary">
                                    {video.title}
                                  </h3>
                                </Link>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Ditonton: {video.watchedAt}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <History className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Riwayat Tontonan Kosong
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Video yang telah kamu tonton akan secara otomatis muncul di
                halaman ini.
              </p>
              <Button className="mt-6 rounded-full">
                <Link href="/">Mulai Menonton</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

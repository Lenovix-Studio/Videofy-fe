"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Play, Trash2, Search } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface VideoFavorite {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  date: string;
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function FavoritesPage() {
  const [videos, setVideos] = useState<VideoFavorite[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch list video favorite
  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const response = await fetch(
        `http://localhost:3001/favorites?${queryParams.toString()}`,
      );
      if (!response.ok) throw new Error("Gagal memuat data favorit");

      const result = await response.json();
      const mappedVideos = result.data.map((video: any) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail.startsWith("http")
          ? video.thumbnail
          : `http://localhost:3001${video.thumbnail}`,
        duration: `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, "0")}`,
        date: new Date(video.createdAt).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));
      setVideos(mappedVideos);
      setMeta(result.meta);
    } catch (error: any) {
      toast.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // handle remove favorite video
  const handleRemoveFavorite = async (videoId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/favorites/${videoId}/favorite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Gagal menghapus video dari favorit");

      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.id !== videoId),
      );

      if (videos.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchFavorites();
      }
      toast.success("Berhasil menghapus favorite video");
    } catch (error: any) {
      toast.error("Error removing favorite:", error);
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Cari di daftar favorit..."
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3 animate-pulse">
                  <div className="aspect-video rounded-xl bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted mx-4" />
                  <div className="h-3 w-1/4 rounded bg-muted mx-4" />
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <>
              {/* Video Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videos.map((video) => (
                  <Card
                    key={video.id}
                    className="group overflow-hidden border-none bg-transparent shadow-none pt-0"
                  >
                    <CardContent className="p-0 space-y-3">
                      {/* Thumbnail */}
                      <Link
                        href={`/watch/${video.id}`}
                        className="block relative"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted group">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />

                          {/* Play Hover Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                            <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                              <Play className="ml-0.5 h-5 w-5 fill-current" />
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveFavorite(video.id);
                            }}
                            title="Hapus dari Favorit"
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
                      <div className="flex items-start justify-between gap-2 px-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <Link href={`/watch/${video.id}`}>
                            <h3 className="line-clamp-1 text-sm font-semibold leading-snug transition group-hover:text-primary">
                              {video.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {video.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Halaman {meta.currentPage} dari {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === meta.totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Belum Ada Video Favorit
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                {searchQuery
                  ? "Tidak ada video favorit yang sesuai dengan kata kunci pencarian kamu."
                  : "Simpan video menarik ke daftar favorit dengan menekan ikon favorit di video player atau menu video."}
              </p>
              <Button className="mt-6 rounded-full">
                <Link href="/explore">Jelajahi Video</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Play, Grid, Hash, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export default function TagsPage() {
  const [tagsList, setTagsList] = useState<TagItem[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTagQuery, setSearchTagQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    setPage(1);
    setFilteredVideos([]);
  }, [selectedTag]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchTagQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTagQuery]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);

        let url = "http://localhost:3001/tags?limit=20";
        if (debouncedSearchQuery.trim() !== "") {
          url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Gagal mengambil data tag dari server");
        }

        const data: TagItem[] = await response.json();
        setTagsList(data);
      } catch (err: any) {
        toast(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const fetchVideosByTag = async () => {
      setIsVideoLoading(true);
      try {
        const tagParam =
          selectedTag && selectedTag !== "all" ? `tagId=${selectedTag}&` : "";
        const url = `http://localhost:3001/tags/videos?${tagParam}page=${page}&limit=8`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal mengambil data video");

        const result = await res.json();

        const mappedVideos = result.data.map((video: any) => ({
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnailUrl.startsWith("http")
            ? video.thumbnailUrl
            : `http://localhost:3001${video.thumbnailUrl}`,
          duration: `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, "0")}`,
          date: new Date(video.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));

        setFilteredVideos((prev) =>
          page === 1 ? mappedVideos : [...prev, ...mappedVideos],
        );

        setHasMore(page < result.meta.totalPages);
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsVideoLoading(false);
      }
    };

    fetchVideosByTag();
  }, [selectedTag, page]);

  const activeTagName =
    tagsList.find((t) => t.id === selectedTag)?.name || "Semua Video";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        center={
          <div className="flex max-w-2xl flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTagQuery}
                onChange={(e) => setSearchTagQuery(e.target.value)}
                type="text"
                placeholder="Cari tag atau genre..."
                className="h-10 w-full rounded-full bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-1"
              />
            </div>
          </div>
        }
      />

      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:pl-52 pt-20 pb-12 px-4 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Hash className="h-4 w-4" /> Pilih Kategori / Tag
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat kategori...
              </div>
            )}

            {!isLoading && (
              <div className="flex flex-wrap gap-2">
                {tagsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada tag tersedia.
                  </p>
                ) : (
                  tagsList.map((tag) => {
                    const isActive = selectedTag === tag.id;
                    return (
                      <Button
                        key={tag.id}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedTag(isActive ? null : tag.id);
                        }}
                        className="rounded-full gap-1.5 text-xs transition"
                      >
                        <span>{tag.name}</span>
                        <Badge
                          variant={isActive ? "secondary" : "ghost"}
                          className="ml-1 rounded-full px-1.5 py-0 text-[10px]"
                        >
                          {tag.count}
                        </Badge>
                      </Button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Video Grid Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold tracking-tight">
                Video dengan Tag:{" "}
                <span className="text-primary">{activeTagName}</span>
              </h2>
              <span className="text-xs text-muted-foreground">
                Menampilkan {filteredVideos.length} video
              </span>
            </div>

            {isVideoLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                Memuat video...
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="group overflow-hidden border-none bg-transparent shadow-none pt-0"
                  >
                    <CardContent className="p-0 space-y-3">
                      <Link
                        href={`/watch/${video.id}`}
                        className="block relative"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-full w-full object-cover transition"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                            <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                              <Play className="ml-0.5 h-5 w-5 fill-current" />
                            </div>
                          </div>

                          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                            {video.duration}
                          </span>
                        </div>
                      </Link>

                      <div className="space-y-1 px-4">
                        <Link href={`/watch/${video.id}`}>
                          <h3 className="line-clamp-1 text-sm font-semibold leading-snug transition group-hover:text-primary">
                            {video.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {video.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Grid className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Tidak Ada Video</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  Belum ada video yang dikategorikan ke dalam tag ini.
                </p>
                <Button
                  onClick={() => setSelectedTag("all")}
                  variant="outline"
                  className="mt-4 rounded-full"
                >
                  Lihat Semua Tag
                </Button>
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center pt-8">
                <Button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isVideoLoading}
                  variant="outline"
                  className="rounded-full px-6"
                >
                  {isVideoLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    "Muat Lebih Banyak Video"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

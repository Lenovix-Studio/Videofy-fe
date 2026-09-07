"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Play,
  Trash2,
  Search,
  MoreVertical,
  Share2,
} from "lucide-react";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Data Dummy Video Favorit
const initialFavoriteVideos = [
  {
    id: "1",
    title: "Building Videofy - Next.js 15 & Tailwind CSS Full Tutorial",
    views: 12400,
    date: "2 days ago",
    duration: "24:15",
    thumbnail: "https://picsum.photos/seed/videofy/600/340",
    uploader: "Kamil Sudarmi",
  },
  {
    id: "3",
    title: "React Native & Expo Setup Guide 2026",
    views: 15400,
    date: "2 weeks ago",
    duration: "22:05",
    thumbnail: "https://picsum.photos/seed/expo/600/340",
    uploader: "Mobile Dev Hub",
  },
  {
    id: "5",
    title: "Hearts of Iron 4: Complete Resource & Supply Guide",
    views: 28900,
    date: "3 days ago",
    duration: "18:40",
    thumbnail: "https://picsum.photos/seed/hoi4/600/340",
    uploader: "Strategy Master",
  },
];

export default function FavoritesPage() {
  const [favoriteVideos, setFavoriteVideos] = useState(initialFavoriteVideos);
  const [searchQuery, setSearchQuery] = useState("");

  // Handler Hapus Satu Video
  const handleRemoveFavorite = (id: string) => {
    setFavoriteVideos((prev) => prev.filter((video) => video.id !== id));
  };

  // Handler Hapus Semua Video
  const handleClearAll = () => {
    if (
      confirm("Apakah kamu yakin ingin menghapus semua video dari favorit?")
    ) {
      setFavoriteVideos([]);
    }
  };

  // Filter Berdasarkan Pencarian
  const filteredVideos = favoriteVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Standard */}
      <Header />

      {/* Sidebar Standard */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:pl-52 pt-20 pb-12 px-4 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
                <p className="text-xs text-muted-foreground">
                  {favoriteVideos.length} video tersimpan di favorit kamu
                </p>
              </div>
            </div>

            {/* Clear All Button */}
            {favoriteVideos.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" /> Hapus Semua
              </Button>
            )}
          </div>

          {/* Search Filter Bar */}
          {favoriteVideos.length > 0 && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari di daftar favorit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          )}

          {/* Video Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="group overflow-hidden border-none bg-transparent shadow-none"
                >
                  <CardContent className="p-0 space-y-3">
                    {/* Thumbnail */}
                    <Link
                      href={`/watch/${video.id}`}
                      className="block relative"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />

                        {/* Play Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                          <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                          {video.duration}
                        </span>
                      </div>
                    </Link>

                    {/* Meta Info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1 space-y-1">
                        <Link href={`/watch/${video.id}`}>
                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition group-hover:text-primary">
                            {video.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {video.uploader}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {video.views.toLocaleString()} views • {video.date}
                        </p>
                      </div>

                      {/* Options Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 rounded-full"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Options</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleRemoveFavorite(video.id)}
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" /> Hapus dari Favorit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Share2 className="h-4 w-4" /> Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
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

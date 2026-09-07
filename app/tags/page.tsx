"use client";

import { useState } from "react";
import Link from "next/link";
import { Tags, Search, Play, Grid, Hash } from "lucide-react";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Data Dummy Tags & Genres
const initialTags = [
  { id: "all", name: "Semua Tag", count: 42 },
  { id: "nextjs", name: "Next.js", count: 12 },
  { id: "react", name: "React Native", count: 8 },
  { id: "gaming", name: "Gaming & Strategy", count: 15 },
  { id: "web-dev", name: "Web Development", count: 18 },
  { id: "python", name: "Python & Scraping", count: 9 },
  { id: "tutorial", name: "Tutorial & Tips", count: 24 },
];

// Data Dummy Video Berdasarkan Tag
const allVideos = [
  {
    id: "1",
    title: "Building Videofy - Next.js 15 & Tailwind CSS Full Tutorial",
    views: 12400,
    date: "2 days ago",
    duration: "24:15",
    thumbnail: "https://picsum.photos/seed/videofy/600/340",
    uploader: "Kamil Sudarmi",
    tags: ["nextjs", "web-dev", "tutorial"],
  },
  {
    id: "2",
    title: "Advanced Web Scraping with Python & Selenium",
    views: 8200,
    date: "1 week ago",
    duration: "14:20",
    thumbnail: "https://picsum.photos/seed/scrape/600/340",
    uploader: "Tech Academy",
    tags: ["python", "web-dev", "tutorial"],
  },
  {
    id: "3",
    title: "React Native & Expo Setup Guide 2026",
    views: 15400,
    date: "2 weeks ago",
    duration: "22:05",
    thumbnail: "https://picsum.photos/seed/expo/600/340",
    uploader: "Mobile Dev Hub",
    tags: ["react", "tutorial"],
  },
  {
    id: "4",
    title: "Hearts of Iron 4: Complete Resource & Supply Guide",
    views: 28900,
    date: "3 days ago",
    duration: "18:40",
    thumbnail: "https://picsum.photos/seed/hoi4/600/340",
    uploader: "Strategy Master",
    tags: ["gaming"],
  },
];

export default function TagsPage() {
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchTagQuery, setSearchTagQuery] = useState("");

  // Filter Tag Pill List
  const filteredTagsList = initialTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTagQuery.toLowerCase()),
  );

  // Filter Video berdasarkan Tag Terpilih
  const filteredVideos =
    selectedTag === "all"
      ? allVideos
      : allVideos.filter((video) => video.tags.includes(selectedTag));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Standard */}
      <Header />

      {/* Sidebar Standard */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:pl-52 pt-20 pb-12 px-4 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-8">
          {/* Page Header */}
          <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Tags className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Tags & Genres
                </h1>
                <p className="text-xs text-muted-foreground">
                  Jelajahi konten berdasarkan topik dan genre yang kamu minati
                </p>
              </div>
            </div>

            {/* Search Tag Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari tag atau genre..."
                value={searchTagQuery}
                onChange={(e) => setSearchTagQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* Tags Chips Bar */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Hash className="h-4 w-4" /> Pilih Kategori / Tag
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredTagsList.map((tag) => {
                const isActive = selectedTag === tag.id;
                return (
                  <Button
                    key={tag.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag.id)}
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
              })}
            </div>
          </div>

          {/* Video Grid Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold tracking-tight">
                Video dengan Tag:{" "}
                <span className="text-primary">
                  {initialTags.find((t) => t.id === selectedTag)?.name}
                </span>
              </h2>
              <span className="text-xs text-muted-foreground">
                Menampilkan {filteredVideos.length} video
              </span>
            </div>

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
                      <div className="space-y-1">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State */
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
          </div>
        </div>
      </main>
    </div>
  );
}

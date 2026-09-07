"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Flame,
  Music2,
  Gamepad2,
  Code,
  Film,
  Play,
} from "lucide-react";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Category Filter List
const categories = [
  { id: "all", label: "All", icon: Compass },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "programming", label: "Programming", icon: Code },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "music", label: "Music", icon: Music2 },
  { id: "movies", label: "Movies", icon: Film },
];

// Data Dummy Video Explore
const exploreVideos = [
  {
    id: "1",
    title: "Building Videofy - Next.js 15 & Tailwind CSS Full Tutorial",
    category: "programming",
    views: 12400,
    date: "2 days ago",
    duration: "24:15",
    thumbnail: "https://picsum.photos/seed/videofy/600/340",
    uploader: "Kamil Sudarmi",
    isTrending: true,
  },
  {
    id: "2",
    title: "Advanced Web Scraping with Python & Selenium",
    category: "programming",
    views: 8200,
    date: "1 week ago",
    duration: "14:20",
    thumbnail: "https://picsum.photos/seed/scrape/600/340",
    uploader: "Tech Academy",
    isTrending: false,
  },
  {
    id: "3",
    title: "React Native & Expo Setup Guide 2026",
    category: "programming",
    views: 15400,
    date: "2 weeks ago",
    duration: "22:05",
    thumbnail: "https://picsum.photos/seed/expo/600/340",
    uploader: "Mobile Dev Hub",
    isTrending: true,
  },
  {
    id: "4",
    title: "Building Mobile Apps with Kotlin & Jetpack Compose",
    category: "programming",
    views: 5100,
    date: "1 month ago",
    duration: "45:10",
    thumbnail: "https://picsum.photos/seed/kotlin/600/340",
    uploader: "Android Craft",
    isTrending: false,
  },
  {
    id: "5",
    title: "Hearts of Iron 4: Complete Resource & Supply Guide",
    category: "gaming",
    views: 28900,
    date: "3 days ago",
    duration: "18:40",
    thumbnail: "https://picsum.photos/seed/hoi4/600/340",
    uploader: "Strategy Master",
    isTrending: true,
  },
  {
    id: "6",
    title: "Lo-Fi Beats for Coding & Focus Session",
    category: "music",
    views: 45000,
    date: "5 days ago",
    duration: "1:00:00",
    thumbnail: "https://picsum.photos/seed/lofi/600/340",
    uploader: "Chill Vibes",
    isTrending: false,
  },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredVideos =
    selectedCategory === "all"
      ? exploreVideos
      : selectedCategory === "trending"
        ? exploreVideos.filter((video) => video.isTrending)
        : exploreVideos.filter((video) => video.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        center={
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Explore</h1>
            </div>
          </div>
        }
      />
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:pl-52 pt-20 pb-12 px-4 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="rounded-full gap-2 shrink-0 transition-all"
                >
                  <Icon className="h-4 w-4" />
                  <span>{cat.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="group overflow-hidden border-none bg-transparent shadow-none pt-0"
              >
                <CardContent className="p-0 space-y-3">
                  {/* Thumbnail */}
                  <Link href={`/watch/${video.id}`} className="block relative">
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
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

                      {/* Duration Badge */}
                      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                        {video.duration}
                      </span>

                      {/* Trending Tag Badge */}
                      {video.isTrending && (
                        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                          <Flame className="h-3 w-3" /> Trending
                        </span>
                      )}
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

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              Tidak ada video yang ditemukan untuk kategori ini.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Play, Trash2, Search, Clock } from "lucide-react";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Data Dummy Riwayat Tontonan (Dikelompokkan Berdasarkan Waktu Waktu Tonton)
const initialHistoryGroups = [
  {
    group: "Today",
    videos: [
      {
        id: "1",
        title: "Building Videofy - Next.js 15 & Tailwind CSS Full Tutorial",
        views: 12400,
        date: "2 days ago",
        duration: "24:15",
        thumbnail: "https://picsum.photos/seed/videofy/600/340",
        uploader: "Kamil Sudarmi",
        watchedAt: "10:30 AM",
      },
      {
        id: "2",
        title: "Advanced Web Scraping with Python & Selenium",
        views: 8200,
        date: "1 week ago",
        duration: "14:20",
        thumbnail: "https://picsum.photos/seed/scrape/600/340",
        uploader: "Tech Academy",
        watchedAt: "08:15 AM",
      },
    ],
  },
  {
    group: "Yesterday",
    videos: [
      {
        id: "3",
        title: "React Native & Expo Setup Guide 2026",
        views: 15400,
        date: "2 weeks ago",
        duration: "22:05",
        thumbnail: "https://picsum.photos/seed/expo/600/340",
        uploader: "Mobile Dev Hub",
        watchedAt: "Yesterday",
      },
      {
        id: "5",
        title: "Hearts of Iron 4: Complete Resource & Supply Guide",
        views: 28900,
        date: "3 days ago",
        duration: "18:40",
        thumbnail: "https://picsum.photos/seed/hoi4/600/340",
        uploader: "Strategy Master",
        watchedAt: "Yesterday",
      },
    ],
  },
];

export default function HistoryPage() {
  const [historyGroups, setHistoryGroups] = useState(initialHistoryGroups);
  const [searchQuery, setSearchQuery] = useState("");

  // Handler Hapus Satu Video dari Riwayat
  const handleRemoveHistory = (groupIdx: number, videoId: string) => {
    setHistoryGroups((prevGroups) => {
      return prevGroups
        .map((group, idx) => {
          if (idx === groupIdx) {
            return {
              ...group,
              videos: group.videos.filter((v) => v.id !== videoId),
            };
          }
          return group;
        })
        .filter((group) => group.videos.length > 0); // Hapus grup jika sudah kosong
    });
  };

  // Hitung Total Video Riwayat
  const totalVideos = historyGroups.reduce(
    (acc, group) => acc + group.videos.length,
    0,
  );

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
          {/* History Lists grouped by date */}
          {totalVideos > 0 ? (
            <div className="space-y-8">
              {historyGroups.map((group, groupIdx) => {
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
                          key={video.id}
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
                                    e.stopPropagation();
                                    handleRemoveHistory(groupIdx, video.id);
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
                            <div className="flex items-start justify-between gap-2 px-4">
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

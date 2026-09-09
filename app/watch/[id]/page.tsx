"use client";

import Link from "next/link";
import { use } from "react"; // 1. Import hook 'use' dari React
import {
  Upload,
  Pencil,
  Trash2,
  Heart,
  Download,
  Calendar,
  Clock,
  HardDrive,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 2. Hapus kata kunci 'async' di sini
export default function WatchPage({ params }: PageProps) {
  // 3. Gunakan 'use(params)' untuk mengambil id secara sinkron di Client Component
  const { id } = use(params);

  // Data dummy video yang sedang ditonton
  const currentVideo = {
    id,
    title: "Building Videofy - Next.js & Tailwind CSS Full Tutorial",
    description:
      "In this video, we'll walk through building Videofy, a full-featured personal video management platform using Next.js App Router, TailwindIn this video, we'll walk through building Videofy, a full-featured personal video management platform using Next.js App Router, TailwindIn this video, we'll walk through building Videofy, a full-featured personal video management platform using Next.js App Router, Tailwind CSS v4, and Base UI / Shadcn components.",
    views: 12400,
    date: "2 days ago",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    likes: 1250,
    uploader: {
      name: "Kamil Sudarmi",
      avatar: "",
      subscribers: "12.5k",
    },
    fileSize: "15.4 MB",
    source: "Local Storage",
    tags: ["Next.js", "Tailwind CSS", "React", "Web Dev", "Shadcn UI"], // 2. Menambahkan array tags di sini
  };

  // Data dummy video terkait (Related Videos)
  const relatedVideos = [
    {
      id: "2",
      title: "Advanced Web Scraping with Python & Selenium",
      views: "8.2K views",
      date: "1 week ago",
      duration: "14:20",
      thumbnail: "https://picsum.photos/seed/scrape/400/225",
    },
    {
      id: "3",
      title: "React Native & Expo Setup Guide 2026",
      views: "15.4K views",
      date: "2 weeks ago",
      duration: "22:05",
      thumbnail: "https://picsum.photos/seed/expo/400/225",
    },
    {
      id: "4",
      title: "Building Mobile Apps with Kotlin & Jetpack Compose",
      views: "5.1K views",
      date: "1 month ago",
      duration: "45:10",
      thumbnail: "https://picsum.photos/seed/kotlin/400/225",
    },
  ];

  const formatDuration = (durationStr: string | number) => {
    const totalSeconds = Number(durationStr) || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Main Content Layout */}
      <main className="mx-auto max-w-[1700px] px-4 pt-20 pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {/* Main Video Section (Left Column) */}
          <div className="lg:col-span-2 xl:col-span-3">
            {/* HTML5 Video Player */}
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
              <video
                src={currentVideo.videoUrl}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            </div>

            {/* Video Title */}
            <h1 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
              {currentVideo.title}
            </h1>

            {/* Technical Metadata Row (Date, Duration, Size, Source) */}
            <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{currentVideo.date}</span>
              </div>
              <Separator
                orientation="vertical"
                className="h-3 hidden sm:block"
              />
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDuration(7)}</span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <div className="flex items-center gap-1">
                <HardDrive className="h-3.5 w-3.5" />
                <span>{currentVideo.fileSize || "15.4 MB"}</span>{" "}
              </div>
              <Separator orientation="vertical" className="h-3" />
              <div className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                <span>{currentVideo.source || "Local Storage"}</span>
              </div>
            </div>

            {/* Channel Info & Actions Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-b py-4 dark:border-muted/40">
              {/* Uploader Profile */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentVideo.uploader.avatar} />
                  <AvatarFallback className="bg-primary/20 font-semibold text-primary">
                    {currentVideo.uploader.name
                      ?.substring(0, 2)
                      .toUpperCase() || "KS"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold leading-none">
                    {currentVideo.uploader.name}
                  </h3>
                </div>
              </div>

              {/* Requested Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Favorite Video Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={() => {
                    /* add favorite logic */
                  }}
                >
                  <Heart className="h-4 w-4 text-red-500 fill-none" />
                  <span>Favorite</span>
                </Button>

                {/* Download Video Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={() => {
                    /* add download handler */
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>

                {/* Edit Video Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                >
                  <Link
                    href={`/edit/${currentVideo.id}`}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                </Button>

                {/* Delete Video Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={() => {
                    /* add delete modal/handler */
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>

            {/* Video Description Box */}
            <Card className="mt-4 rounded-xl bg-muted/40 hover:bg-muted/50 dark:bg-muted/20 dark:hover:bg-muted/30 transition-all duration-200 border-none shadow-none overflow-hidden">
              <CardContent className="p-4 space-y-3.5">
                {/* Tags Row */}
                <div className="flex flex-wrap gap-2">
                  {currentVideo.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-background/60 hover:bg-background dark:bg-background/30 dark:hover:bg-background/50 border border-border/40 text-primary font-medium tracking-wide text-[11px] px-2.5 py-0.5 rounded-md transition-colors cursor-pointer shadow-sm"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Description Paragraph */}
                <div className="pt-0.5">
                  <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-muted-foreground dark:text-foreground/80 font-normal tracking-wide">
                    {currentVideo.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Videos Sidebar (Right Column) */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Up Next</h2>
            <Separator className="my-2" />

            <div className="flex flex-col gap-4">
              {relatedVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/watch/${video.id}`}
                  className="group flex gap-3 rounded-xl p-1.5 transition hover:bg-muted/50"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                      {video.duration}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-xs font-semibold leading-snug transition group-hover:text-primary">
                      {video.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {video.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

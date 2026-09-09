"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import {
  Pencil,
  Trash2,
  Heart,
  Download,
  Calendar,
  Clock,
  HardDrive,
  Globe,
  Eye,
} from "lucide-react";
import { formatFileSize, formatDuration, formatDate } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import notFound from "@/app/not-found";
import WatchLoading from "@/app/loading";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface VideoDetail {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string;
  filePath: string;
  thumbnailPath: string;
  fileName: string;
  duration: number;
  size: number;
  mimeType: string;
  uploader: string;
  views: number;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: Tag[];
}

const getMediaUrl = (path: string): string => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

export default function WatchPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;
  const [currentVideo, setCurrentVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Fetch detail video
  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/videos/${videoId}`);
        if (!res.ok) {
          throw new Error("Gagal mengambil data video");
        }
        const data: VideoDetail = await res.json();
        setCurrentVideo(data);
        setIsFavorite(data.isFavorite);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetail();
    }
  }, [videoId]);

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

  // Handler Download Video
  const handleDownload = () => {
    if (!currentVideo) return;
    const fullVideoUrl = getMediaUrl(currentVideo.videoUrl);
    const a = document.createElement("a");
    a.href = fullVideoUrl;
    a.download = currentVideo.fileName || `${currentVideo.title}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handler Favorite Toggle (UI state)
  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // TODO: Tambahkan panggillan API POST/DELETE untuk favorite jika backend sudah siap
  };

  if (loading) {
    return WatchLoading();
  }

  if (error || (!currentVideo && currentVideo == null)) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Main Content Layout */}
      <main className="mx-auto px-4 pt-20 pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {/* Main Video Section (Left Column) */}
          <div className="lg:col-span-2 xl:col-span-3">
            {/* HTML5 Video Player */}
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
              <video
                src={getMediaUrl(currentVideo.videoUrl)}
                poster={getMediaUrl(currentVideo.thumbnailUrl)}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            </div>

            {/* Video Title */}
            <h1 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
              {currentVideo.title}
            </h1>

            {/* Technical Metadata Row */}
            <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{currentVideo.views} views</span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(currentVideo.createdAt)}</span>
              </div>
              <Separator
                orientation="vertical"
                className="h-3 hidden sm:block"
              />
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDuration(currentVideo.duration)}</span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <div className="flex items-center gap-1">
                <HardDrive className="h-3.5 w-3.5" />
                <span>{formatFileSize(currentVideo.size)}</span>
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
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/20 font-semibold text-primary">
                    {currentVideo.uploader?.substring(0, 2).toUpperCase() ||
                      "AD"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold leading-none">
                    {currentVideo.uploader}
                  </h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Favorite Video Button */}
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite
                        ? "text-red-500 fill-red-500"
                        : "text-red-500 fill-none"
                    }`}
                  />
                  <span>{isFavorite ? "Favorited" : "Favorite"}</span>
                </Button>

                {/* Download Video Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>

                {/* Edit Video Button */}
                <Button variant="outline" size="sm" className="rounded-full">
                  <Link
                    href={`/edit/${currentVideo.id}`}
                    className="flex items-center gap-2"
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
                    /* Handler Hapus Video */
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
                  {currentVideo.tags && currentVideo.tags.length > 0 ? (
                    currentVideo.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="bg-background/60 hover:bg-background dark:bg-background/30 dark:hover:bg-background/50 border border-border/40 text-primary font-medium tracking-wide text-[11px] px-2.5 py-0.5 rounded-md transition-colors cursor-pointer shadow-sm"
                      >
                        #{tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Tidak ada tag
                    </span>
                  )}
                </div>

                {/* Description Paragraph */}
                <div className="pt-0.5">
                  <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-muted-foreground dark:text-foreground/80 font-normal tracking-wide">
                    {currentVideo.description || "Tidak ada deskripsi video."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Videos Sidebar (Right Column) */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Related Videos
            </h2>
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

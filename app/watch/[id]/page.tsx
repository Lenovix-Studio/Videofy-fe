import Link from "next/link";
import {
  Film,
  Search,
  Upload,
  ThumbsUp,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/header";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WatchPage({ params }: PageProps) {
  const { id } = await params;

  // Data dummy video yang sedang ditonton
  const currentVideo = {
    id,
    title: "Building Videofy - Next.js & Tailwind CSS Full Tutorial",
    description:
      "In this video, we'll walk through building Videofy, a full-featured personal video management platform using Next.js App Router, Tailwind CSS v4, and Base UI / Shadcn components.",
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

            {/* Channel Info & Actions Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              {/* Channel Profile */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentVideo.uploader.avatar} />
                  <AvatarFallback className="bg-primary/20 font-semibold text-primary">
                    KS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold leading-none">
                    {currentVideo.uploader.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentVideo.uploader.subscribers} subscribers
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{currentVideo.likes.toLocaleString()}</span>
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Save</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report Video</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Video Description Box */}
            <Card className="mt-4 rounded-xl bg-muted/40 border-none">
              <CardContent className="p-4 text-sm space-y-2">
                <div className="flex gap-2 font-semibold text-xs text-muted-foreground">
                  <span>{currentVideo.views.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{currentVideo.date}</span>
                </div>
                <p className="whitespace-pre-line leading-relaxed text-foreground/90">
                  {currentVideo.description}
                </p>
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Video,
  Image as ImageIcon,
  MoreVertical,
  Play,
  Trash2,
  Calendar,
  Layers,
  Upload,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";

interface PlaylistItem {
  id: string;
  type: "video" | "photo";
  title: string;
  thumbnailUrl: string;
  duration?: string;
  createdAt: string;
}

// Data Dummy Item untuk Playlist Detail
const DUMMY_ITEMS: PlaylistItem[] = [
  {
    id: "1",
    type: "video",
    title: "Cinematic Travel Vlog Bali 2026",
    thumbnailUrl: "https://picsum.photos/seed/video1/600/400",
    duration: "04:15",
    createdAt: "2026-09-15",
  },
  {
    id: "2",
    type: "photo",
    title: "Sunset di Pantai Kuta",
    thumbnailUrl: "https://picsum.photos/seed/photo1/600/400",
    createdAt: "2026-09-16",
  },
  {
    id: "3",
    type: "video",
    title: "Exploring Hidden Waterfalls",
    thumbnailUrl: "https://picsum.photos/seed/video2/600/400",
    duration: "08:30",
    createdAt: "2026-09-18",
  },
  {
    id: "4",
    type: "photo",
    title: "Pemandangan Sawah Ubud",
    thumbnailUrl: "https://picsum.photos/seed/photo2/600/400",
    createdAt: "2026-09-20",
  },
];

export default function PlaylistDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [items, setItems] = useState<PlaylistItem[]>(DUMMY_ITEMS);

  // Format Nama Playlist dari Slug
  const formattedTitle = slug
    ? slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Detail Playlist";

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalVideos = items.filter((i) => i.type === "video").length;
  const totalPhotos = items.filter((i) => i.type === "photo").length;

  return (
    <div className="space-y-6">
      <Header
        left={
          <Link href="/playlists">
            <Button
              variant="ghost"
              className="gap-2 text-sm text-muted-foreground hover:text-foreground pl-0"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Playlists
            </Button>
          </Link>
        }
        center={
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search videos on playlist..."
              className="h-10 w-full rounded-full bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-1"
            />
          </div>
        }
        right={
          <div>
            <Button
              variant="ghost"
              className="rounded-full px-4 text-muted-foreground hover:text-foreground font-medium"
            >
              <Link
                href="#addVideoModal"
                title="Add video"
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                <span>Add Video</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="rounded-full px-4 text-muted-foreground hover:text-foreground font-medium"
            >
              <Link
                href="#addPhotoModal"
                title="Add Photo"
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Add Photo</span>
              </Link>
            </Button>
          </div>
        }
      />
      <div className=" max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Playlist Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-neutral-900 to-neutral-800 p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 backdrop-blur-md">
                <Layers className="h-3.5 w-3.5" /> Playlist
              </div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                {formattedTitle}
              </h1>
              <p className="text-sm md:text-base text-neutral-300 line-clamp-2">
                Koleksi momen dan dokumentasi media dalam playlist ini.
              </p>

              {/* Stats Badge */}
              <div className="flex items-center gap-4 pt-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-blue-400" /> {totalVideos}{" "}
                  Video
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-emerald-400" />{" "}
                  {totalPhotos} Foto
                </span>
              </div>
            </div>

            <Button className="gap-2 bg-white text-black hover:bg-neutral-200 shadow-md">
              <Play className="h-4 w-4 fill-current" /> Putar Semua
            </Button>
          </div>
        </div>

        {/* Tabs Filter Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="all">Semua ({items.length})</TabsTrigger>
            <TabsTrigger value="videos">Video ({totalVideos})</TabsTrigger>
            <TabsTrigger value="photos">Foto ({totalPhotos})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ItemGrid items={items} onDelete={handleDeleteItem} />
          </TabsContent>

          <TabsContent value="videos">
            <ItemGrid
              items={items.filter((i) => i.type === "video")}
              onDelete={handleDeleteItem}
            />
          </TabsContent>

          <TabsContent value="photos">
            <ItemGrid
              items={items.filter((i) => i.type === "photo")}
              onDelete={handleDeleteItem}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Sub Komponen Grid Item Media
function ItemGrid({
  items,
  onDelete,
}: {
  items: PlaylistItem[];
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl">
        <Layers className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium">Belum ada konten di playlist ini</p>
        <p className="text-xs text-muted-foreground mt-1">
          Tambahkan video atau foto untuk mengisi playlist ini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs hover:shadow-md transition-all duration-200"
        >
          {/* Thumbnail & Badge */}
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Type & Duration Badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
              {item.type === "video" ? (
                <>
                  <Video className="h-3 w-3 text-blue-400" />
                  <span>{item.duration}</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-3 w-3 text-emerald-400" />
                  <span>Foto</span>
                </>
              )}
            </div>

            {/* Dropdown Menu Trigger tanpa asChild */}
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => onDelete(item.id)}
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Hapus dari Playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Info Detail */}
          <div className="p-3 space-y-1">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{item.createdAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

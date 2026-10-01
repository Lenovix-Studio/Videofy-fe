"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Image as ImageIcon,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/lib/constant";

export interface PlaylistItem {
  id: string; // refer to videoId or photoId
  playlistItemId?: string; // refer to PlaylistItem.id in DB
  type: "video" | "photo";
  title: string;
  thumbnailUrl: string;
  duration?: string;
  createdAt: string;
}

interface ClientViewProps {
  slug: string;
  playlistId?: string;
  playlistTitle: string;
  initialItems: PlaylistItem[];
}

export function PlaylistDetailClientView({
  slug,
  playlistId,
  playlistTitle,
  initialItems,
}: ClientViewProps) {
  const [items, setItems] = useState<PlaylistItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  // Filter based on search query
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const photosList = items.filter((i) => i.type === "photo");

  const handleItemClick = (item: PlaylistItem) => {
    if (item.type === "video") {
      window.location.href = `/watch/${item.id}?list=${slug}`;
    } else {
      const idx = photosList.findIndex((p) => p.id === item.id);
      if (idx !== -1) setSelectedPhotoIndex(idx);
    }
  };

  const handlePlayAll = () => {
    const firstVideo = items.find((item) => item.type === "video");
    if (firstVideo) {
      window.location.href = `/watch/${firstVideo.id}?list=${slug}`;
    } else {
      alert("Tidak ada video di dalam playlist ini.");
    }
  };

  const handleAddMedia = async (
    e: React.FormEvent<HTMLFormElement>,
    type: "video" | "photo",
  ) => {
    e.preventDefault();
    if (type !== "photo" || !playlistId) return;

    const formData = new FormData(e.currentTarget);
    formData.append("playlistId", playlistId);
    
    try {
      setIsUploading(true);
      const res = await fetch(`${BACKEND_URL}/videos/upload-photo`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal mengupload foto");

      const data = await res.json();
      
      const newItem: PlaylistItem = {
        id: data.id,
        type: "photo",
        title: data.title,
        thumbnailUrl: data.photoUrl,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setItems((prev) => [newItem, ...prev]);
      setIsAddPhotoOpen(false);
    } catch (err) {
      alert("Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (id: string, playlistItemId?: string) => {
    // Optimistic delete
    setItems((prev) => prev.filter((item) => item.id !== id));
    
    if (playlistItemId && playlistId) {
       try {
         await fetch(`${BACKEND_URL}/playlists/${playlistId}/items/${playlistItemId}`, { method: 'DELETE' });
       } catch (err) {}
    }
  };

  const totalVideos = items.filter((i) => i.type === "video").length;
  const totalPhotos = items.filter((i) => i.type === "photo").length;

  return (
    <div className="space-y-6 mt-15">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media in playlist..."
              className="h-10 w-full rounded-full bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-1"
            />
          </div>
        }
        right={
          <div className="flex gap-2">
            <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
              <DialogTrigger className="flex items-center justify-center rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium gap-2">
                <ImageIcon className="h-4 w-4" />
                <span>Add Photo</span>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={(e) => handleAddMedia(e, "photo")}>
                  <DialogHeader>
                    <DialogTitle>Add Photo to Playlist</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="photo-title">Photo Title</Label>
                      <Input
                        id="photo-title"
                        name="title"
                        placeholder="Enter photo title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo-tags">Tags</Label>
                      <Input
                        id="photo-tags"
                        name="tags"
                        placeholder="e.g. scenery, beach, vacation (comma separated)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo-file">Upload Photo</Label>
                      <Input
                        id="photo-file"
                        name="photo"
                        type="file"
                        accept="image/*"
                        required
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddPhotoOpen(false)}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Add Photo"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              className="rounded-full px-4 font-medium"
            >
              <Link
                href="#deletePlaylist"
                title="Delete Playlist"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Playlist</span>
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
                {playlistTitle}
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

            <Button onClick={handlePlayAll} className="gap-2 bg-white text-black hover:bg-neutral-200 shadow-md cursor-pointer">
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
            <ItemGrid items={filteredItems} onItemClick={handleItemClick} onDeleteClick={handleDeleteItem} />
          </TabsContent>

          <TabsContent value="videos">
            <ItemGrid
              items={filteredItems.filter((i) => i.type === "video")}
              onItemClick={handleItemClick}
              onDeleteClick={handleDeleteItem}
            />
          </TabsContent>

          <TabsContent value="photos">
            <ItemGrid
              items={filteredItems.filter((i) => i.type === "photo")}
              onItemClick={handleItemClick}
              onDeleteClick={handleDeleteItem}
            />
          </TabsContent>
        </Tabs>

        {/* Photo Slideshow Modal */}
        <Dialog
          open={selectedPhotoIndex !== null}
          onOpenChange={(open) => !open && setSelectedPhotoIndex(null)}
        >
          <DialogContent className="max-w-5xl bg-black/95 text-white border-none shadow-2xl p-0 h-[85vh] flex flex-col justify-center">
            <DialogTitle className="sr-only">Photo Slideshow</DialogTitle>
            {selectedPhotoIndex !== null && photosList[selectedPhotoIndex] && (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
                <img
                  src={
                    photosList[selectedPhotoIndex].thumbnailUrl.startsWith("http")
                      ? photosList[selectedPhotoIndex].thumbnailUrl
                      : `${BACKEND_URL}${photosList[selectedPhotoIndex].thumbnailUrl}`
                  }
                  alt={photosList[selectedPhotoIndex].title}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out cursor-zoom-in hover:scale-110"
                />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent text-center">
                  <h3 className="text-lg font-medium">
                    {photosList[selectedPhotoIndex].title}
                  </h3>
                </div>

                {/* Prev Button */}
                <Button
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    setSelectedPhotoIndex((prev) =>
                      prev !== null && prev > 0
                        ? prev - 1
                        : photosList.length - 1,
                    )
                  }
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>

                {/* Next Button (Simulated with rotating arrow or just another button) */}
                <Button
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity rotate-180"
                  onClick={() =>
                    setSelectedPhotoIndex((prev) =>
                      prev !== null && prev < photosList.length - 1
                        ? prev + 1
                        : 0,
                    )
                  }
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Sub Komponen Grid Item Media
function ItemGrid({
  items,
  onItemClick,
  onDeleteClick,
}: {
  items: PlaylistItem[];
  onItemClick: (item: PlaylistItem) => void;
  onDeleteClick?: (id: string, playlistItemId?: string) => void;
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
          onClick={() => onItemClick(item)}
          className="group cursor-pointer relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs hover:shadow-md transition-all duration-200"
        >
          {/* Thumbnail & Badge */}
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <img
              src={item.thumbnailUrl?.startsWith("http") ? item.thumbnailUrl : `${BACKEND_URL}${item.thumbnailUrl}`}
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
          </div>

          {/* Info Detail */}
          <div className="p-3 space-y-1 relative">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors pr-6">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{item.createdAt}</span>
            </div>
            
            {onDeleteClick && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(item.id, item.playlistItemId);
                }}
                className="absolute right-2 top-2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="Hapus dari playlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

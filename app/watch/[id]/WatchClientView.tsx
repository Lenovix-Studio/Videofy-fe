"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  Loader2,
  ListVideo,
  Plus,
} from "lucide-react";
import {
  formatFileSize,
  formatDuration,
  formatDate,
  getMediaUrl,
} from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CustomMediaPlayer } from "@/components/CustomMediaPlayer";
import { BACKEND_URL } from "@/lib/constant";
import { RelatedVideo, VideoDetail } from "@/lib/types";

interface WatchClientViewProps {
  videoId: string;
  listId?: string;
  initialVideo: VideoDetail;
  initialRelatedVideos: RelatedVideo[];
  userPlaylists: any[];
  playlistQueue?: any;
}

export function WatchClientView({
  videoId,
  listId,
  initialVideo,
  initialRelatedVideos,
  userPlaylists,
  playlistQueue,
}: WatchClientViewProps) {
  const router = useRouter();

  const [currentVideo, setCurrentVideo] = useState<VideoDetail>(initialVideo);
  const [relatedVideos, setRelatedVideos] =
    useState<RelatedVideo[]>(initialRelatedVideos);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    initialVideo.isFavorite || false,
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [playlistsState, setPlaylistsState] = useState<any[]>(userPlaylists);

  // Handler Hapus Video
  const handleDeleteVideo = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`${BACKEND_URL}/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus video");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus video");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler Download Video
  const handleDownload = () => {
    window.location.href = `${BACKEND_URL}/videos/${currentVideo.id}/download`;
  };

  // Handler Favorite
  const handleToggleFavorite = async () => {
    setIsFavorite((prev) => !prev);
    try {
      const response = await fetch(
        `${BACKEND_URL}/favorites/${currentVideo.id}/favorite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal memproses favorit");
      }

      const data = await response.json();
      setIsFavorite(data.isFavorite);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengubah status favorit");
      setIsFavorite((prev) => !prev);
    }
  };

  const handleTogglePlaylist = async (playlistId: string, isChecked: boolean, savedItemId?: string) => {
    if (isChecked) {
      // Optimistic update
      const tempId = Date.now().toString();
      setPlaylistsState((prev) => prev.map((p) => p.id === playlistId ? { ...p, items: [...(p.items || []), { id: tempId, videoId, type: "video" }] } : p));
      
      try {
        const res = await fetch(`${BACKEND_URL}/playlists/${playlistId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'video', videoId })
        });
        
        if (res.ok) {
          const newItem = await res.json();
          setPlaylistsState((prev) => prev.map((p) => p.id === playlistId ? { ...p, items: p.items.map((i: any) => i.id === tempId ? newItem : i) } : p));
          toast.success("Tersimpan ke playlist");
        } else {
          throw new Error("Gagal menyimpan");
        }
      } catch (err) {
        toast.error("Gagal menyimpan ke playlist");
        // Revert
        setPlaylistsState((prev) => prev.map((p) => p.id === playlistId ? { ...p, items: p.items.filter((i: any) => i.id !== tempId) } : p));
      }
    } else if (savedItemId) {
      // Optimistic delete
      setPlaylistsState((prev) => prev.map((p) => p.id === playlistId ? { ...p, items: p.items.filter((i: any) => i.id !== savedItemId) } : p));
      
      try {
        const res = await fetch(`${BACKEND_URL}/playlists/${playlistId}/items/${savedItemId}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success("Dihapus dari playlist");
        } else {
          throw new Error("Gagal menghapus");
        }
      } catch (err) {
        toast.error("Gagal menghapus dari playlist");
        // Revert is harder without original item, but for simplicity we reload or rely on accurate state
        router.refresh(); 
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Main Content Layout */}
      <main className="mx-auto px-4 pt-20 pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {/* Main Video Section (Left Column) */}
          <div className="lg:col-span-2 xl:col-span-3">
            {/* Custom Media Player */}
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
              <CustomMediaPlayer
                src={getMediaUrl(currentVideo.videoUrl)}
                poster={getMediaUrl(currentVideo.thumbnailUrl)}
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
              {currentVideo.source && (
                <>
                  <Separator orientation="vertical" className="h-3" />
                  <div className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    <span>{currentVideo.source}</span>
                  </div>
                </>
              )}
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

                {/* Add to Playlist Button */}
                <Dialog>
                  <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs font-medium">
                    <ListVideo className="h-4 w-4" />
                    <span>Save</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                      <DialogTitle>Save to playlist</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      {userPlaylists.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center">You don't have any playlists yet.</p>
                      ) : (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {playlistsState.map((playlist) => {
                            const savedItem = playlist.items?.find((item: any) => item.videoId === videoId && item.type === "video");
                            const isSaved = !!savedItem;

                            return (
                              <label key={playlist.id} className="flex items-center gap-3 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={isSaved}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                                  onChange={(e) => handleTogglePlaylist(playlist.id, e.target.checked, savedItem?.id)}
                                />
                                <span className="text-sm">{playlist.title}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-primary hover:text-primary"
                      >
                        <Plus className="h-4 w-4" /> Create new playlist
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

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
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-full gap-2"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                      </Button>
                    }
                  />

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Video Ini?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Video{" "}
                        <strong>"{currentVideo.title}"</strong> dan semua file
                        terkait akan dihapus secara permanen dari server.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteVideo}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

          {/* Related Videos / Playlist Sidebar (Right Column) */}
          <div className="space-y-4">
            {listId && playlistQueue ? (
              <div className="bg-muted/30 rounded-xl border p-4 mb-6">
                <h2 className="text-sm font-semibold tracking-tight">
                  {playlistQueue.title}
                </h2>
                <p className="text-xs text-muted-foreground mb-3">
                  Playlist Queue
                </p>
                <div className="flex flex-col gap-2 max-h-100 overflow-y-auto pr-2">
                  {playlistQueue.items?.map((item: any) => {
                    // Hanya tampilkan video (lewati foto)
                    if (item.type !== "video") return null;
                    const isCurrent = item.videoId === videoId;
                    
                    return (
                      <Link
                        key={item.id}
                        href={`/watch/${item.videoId}?list=${listId}`}
                        className={`group flex gap-3 rounded-lg p-2 transition ${isCurrent ? "bg-primary/10" : "hover:bg-muted/50"}`}
                      >
                        <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded bg-muted">
                          <img
                            src={`${BACKEND_URL}${item.video?.thumbnailUrl || ""}`}
                            alt={item.video?.title || "Video"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`line-clamp-2 text-xs font-semibold leading-snug ${isCurrent ? "text-primary" : ""}`}>
                            {item.video?.title}
                          </h3>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {item.video?.uploader || "Uploader"}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <h2 className="text-lg font-semibold tracking-tight">
              Related Videos
            </h2>
            <Separator className="my-2" />

            <div className="flex flex-col gap-4">
              {relatedVideos.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Tidak ada video terkait.
                </p>
              ) : (
                relatedVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/watch/${video.id}`}
                    className="group flex gap-3 rounded-xl p-1.5 transition hover:bg-muted/50"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={getMediaUrl(video.thumbnail)}
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
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

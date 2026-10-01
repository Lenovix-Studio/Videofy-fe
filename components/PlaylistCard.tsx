"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FilePlay,
  Video,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Playlist } from "@/types/playlist";
import { BACKEND_URL } from "@/lib/constant";

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit?: (playlist: Playlist) => void;
  onDelete?: (playlistId: string) => void;
}

export function PlaylistCard({
  playlist,
  onEdit,
  onDelete,
}: PlaylistCardProps) {
  const totalVideos = playlist.stats?.totalVideos ?? 0;
  const totalPhotos = playlist.stats?.totalPhotos ?? 0;

  // Extract thumbnails from items
  const thumbnails = (playlist.items || [])
    .map(i => i.type === 'video' ? i.video?.thumbnailUrl : i.photo?.photoUrl)
    .filter(Boolean) as string[];

  const renderCover = () => {
    // If a custom cover exists, use it
    if (playlist.coverUrl) {
      return (
        <Image
          src={playlist.coverUrl.startsWith('http') ? playlist.coverUrl : `${BACKEND_URL}${playlist.coverUrl}`}
          alt={playlist.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      );
    }

    // If we have items for a collage
    if (thumbnails.length > 0) {
      if (thumbnails.length === 1) {
        return (
          <img
            src={thumbnails[0].startsWith('http') ? thumbnails[0] : `${BACKEND_URL}${thumbnails[0]}`}
            alt="Thumbnail"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        );
      }
      
      if (thumbnails.length === 2) {
        return (
          <div className="flex w-full h-full">
            <img src={`${BACKEND_URL}${thumbnails[0]}`} className="w-1/2 h-full object-cover border-r border-background/20 transition-transform duration-500 group-hover:scale-105" alt="Thumb 1" />
            <img src={`${BACKEND_URL}${thumbnails[1]}`} className="w-1/2 h-full object-cover border-l border-background/20 transition-transform duration-500 group-hover:scale-105" alt="Thumb 2" />
          </div>
        );
      }

      if (thumbnails.length === 3) {
        return (
          <div className="flex w-full h-full">
            <div className="w-1/2 h-full border-r border-background/20 overflow-hidden">
              <img src={`${BACKEND_URL}${thumbnails[0]}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Thumb 1" />
            </div>
            <div className="flex flex-col w-1/2 h-full border-l border-background/20 overflow-hidden">
              <img src={`${BACKEND_URL}${thumbnails[1]}`} className="w-full h-1/2 object-cover border-b border-background/20 transition-transform duration-500 group-hover:scale-105" alt="Thumb 2" />
              <img src={`${BACKEND_URL}${thumbnails[2]}`} className="w-full h-1/2 object-cover border-t border-background/20 transition-transform duration-500 group-hover:scale-105" alt="Thumb 3" />
            </div>
          </div>
        );
      }

      // 4 or more
      return (
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full overflow-hidden">
          {thumbnails.slice(0, 4).map((thumb, idx) => (
            <div key={idx} className={`relative overflow-hidden ${
              idx === 0 ? 'border-r border-b border-background/20' :
              idx === 1 ? 'border-l border-b border-background/20' :
              idx === 2 ? 'border-r border-t border-background/20' :
              'border-l border-t border-background/20'
            }`}>
              <img src={`${BACKEND_URL}${thumb}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={`Thumb ${idx}`} />
            </div>
          ))}
        </div>
      );
    }

    // Fallback
    return (
      <div className="flex h-full w-full items-center justify-center bg-secondary/50 text-muted-foreground transition-transform duration-500 group-hover:scale-105">
        <FilePlay className="h-12 w-12 stroke-[1.5]" />
      </div>
    );
  };

  return (
    <Card className="group overflow-hidden border-border/60 bg-card hover:border-primary/50 transition-all duration-300 shadow-xs hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Link
            href={`/playlists/${playlist.slug}`}
            className="block h-full w-full"
          >
            {renderCover()}

            {/* Overlay Gradient */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2 py-1 border border-white/10">
                  <Video className="h-3.5 w-3.5 text-primary" />
                  {totalVideos} Video
                </span>
                <span className="flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2 py-1 border border-white/10">
                  <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
                  {totalPhotos} Foto
                </span>
              </div>
            </div>
          </Link>

          {/* Quick Actions Menu */}
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(playlist)}
                    className="cursor-pointer gap-2"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(playlist.id)}
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" /> Hapus
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="p-4">
          <Link href={`/playlists/${playlist.slug}`}>
            <h3 className="line-clamp-1 font-semibold text-base transition group-hover:text-primary">
              {playlist.title}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground min-h-8">
            {playlist.description || "Tidak ada deskripsi"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

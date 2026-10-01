"use client";

import React, { useState } from "react";
import { Plus, Search, FilePlay, LayoutGrid, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaylistCard } from "@/components/PlaylistCard";
import { PlaylistModal } from "@/components/PlaylistModal";
import { Playlist } from "@/types/playlist";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";

// Mock Data Awal untuk Visualisasi FE
const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: "1",
    title: "Koleksi Tutorial Next.js & NestJS",
    slug: "koleksi-tutorial-nextjs-nestjs",
    description:
      "Kumpulan video dokumentasi belajar fullstack web development.",
    coverUrl:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: { totalVideos: 12, totalPhotos: 0 },
  },
  {
    id: "2",
    title: "Gallery Foto & Video Trip Bali",
    slug: "gallery-foto-video-trip-bali",
    description: "Dokumentasi liburan keluarga dan pemandangan pantai.",
    coverUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: { totalVideos: 5, totalPhotos: 48 },
  },
  {
    id: "3",
    title: "Setup Workspace & IT Setup",
    slug: "setup-workspace-it-setup",
    description: "Inspirasi desk tour, hardware PC, dan peranti IT.",
    coverUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: { totalVideos: 3, totalPhotos: 15 },
  },
];

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  // Filter Search
  const filteredPlaylists = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Create / Update Handler
  const handleSavePlaylist = (data: {
    title: string;
    description: string;
    coverUrl?: string;
    coverFile?: File | null;
  }) => {
    const finalCoverUrl = data.coverFile
      ? URL.createObjectURL(data.coverFile)
      : data.coverUrl || null;

    if (editingPlaylist) {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === editingPlaylist.id
            ? {
                ...p,
                title: data.title,
                description: data.description,
                coverUrl: finalCoverUrl,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      );
    } else {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        title: data.title,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: data.description,
        coverUrl: finalCoverUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: { totalVideos: 0, totalPhotos: 0 },
      };
      setPlaylists((prev) => [newPlaylist, ...prev]);
    }
  };

  // Delete Handler
  const handleDeletePlaylist = (id: string) => {
    if (confirm("Apakah kamu yakin ingin menghapus playlist ini?")) {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPlaylist(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setIsModalOpen(true);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 ">
      <Header
        center={
          <div className="flex max-w-2xl flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="h-10 w-full rounded-full bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-1"
              />
            </div>
          </div>
        }
        right={
          <>
            <Button
              onClick={handleOpenCreateModal}
              variant="ghost"
              className="rounded-full px-4 text-muted-foreground hover:text-foreground font-medium"
            >
              <FilePlay className="h-4 w-4" />
              <span>Create Playlist</span>
            </Button>
            <Button
              variant="ghost"
              className="rounded-full px-4 text-muted-foreground hover:text-foreground font-medium"
            >
              <Link
                href="/upload"
                title="Upload video"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Video</span>
              </Link>
            </Button>
          </>
        }
      />
      <Sidebar />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-16 space-y-8">
        {/* Grid List Playlist */}
        {filteredPlaylists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onEdit={handleOpenEditModal}
                onDelete={handleDeletePlaylist}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <FilePlay className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
              Tidak ada playlist ditemukan
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
              {searchQuery
                ? `Tidak ada playlist yang cocok dengan kata kunci "${searchQuery}"`
                : "Kamu belum membuat playlist apa pun. Mulai buat playlist pertamamu!"}
            </p>
            {!searchQuery && (
              <Button onClick={handleOpenCreateModal} className="gap-2">
                <Plus className="h-4 w-4" /> Buat Playlist Sekarang
              </Button>
            )}
          </div>
        )}

        {/* Modal Dialog Form */}
        <PlaylistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSavePlaylist}
          initialData={editingPlaylist}
        />
      </div>
    </div>
  );
}

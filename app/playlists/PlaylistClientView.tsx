"use client";

import { useState } from "react";
import { Plus, Search, FilePlay, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaylistCard } from "@/components/PlaylistCard";
import { PlaylistModal } from "@/components/PlaylistModal";
import { Playlist } from "@/types/playlist";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/constant";

export function PlaylistClientView({
  initialPlaylists,
}: {
  initialPlaylists: Playlist[];
}) {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
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
  const handleSavePlaylist = async (data: {
    title: string;
    description: string;
    coverUrl?: string;
    coverFile?: File | null;
  }) => {
    try {
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
        const res = await fetch(`${BACKEND_URL}/playlists`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            coverUrl: finalCoverUrl,
          }),
        });

        if (res.ok) {
          const newPlaylist = await res.json();
          newPlaylist.stats = { totalVideos: 0, totalPhotos: 0 };
          setPlaylists((prev) => [newPlaylist, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Handler
  const handleDeletePlaylist = async (id: string) => {
    if (confirm("Apakah kamu yakin ingin menghapus playlist ini?")) {
      try {
        await fetch(`${BACKEND_URL}/playlists/${id}`, { method: "DELETE" });
        setPlaylists((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
      }
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
                placeholder="Search playlists..."
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
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center w-full">
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

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Playlist } from "@/types/playlist";
import { Upload, X, ImageIcon } from "lucide-react";

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    coverUrl?: string;
    coverFile?: File | null;
  }) => void;
  initialData?: Playlist | null;
}

export function PlaylistModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PlaylistModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setCoverUrl(initialData.coverUrl || "");
      setPreviewUrl(initialData.coverUrl || null);
    } else {
      setTitle("");
      setDescription("");
      setCoverUrl("");
      setPreviewUrl(null);
    }
    setCoverFile(null);
  }, [initialData, isOpen]);

  // Handle pemilihan file gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Harap pilih file gambar yang valid");
        return;
      }
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Hapus gambar terpilih
  const handleRemoveImage = () => {
    setCoverFile(null);
    setCoverUrl("");
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      coverUrl,
      coverFile,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Playlist" : "Buat Playlist Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Judul Playlist</label>
            <Input
              placeholder="Contoh: Liburan Bali 2026, Modul React, dll"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Deskripsi (Opsional)</label>
            <Textarea
              placeholder="Tambahkan catatan atau deskripsi singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Upload Cover Gambar */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">
              Cover Gambar (Opsional)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative h-40 w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={previewUrl}
                  alt="Preview Cover"
                  className="h-full w-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <div className="rounded-full bg-background p-2 shadow-xs">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    PNG, JPG, WEBP hingga 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {initialData ? "Simpan Perubahan" : "Buat Playlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  FileVideo,
  X,
  CheckCircle2,
  Tag,
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Header } from "@/components/header";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      handleSetVideoFile(file);
    } else {
      toast.error("File harus berupa video!");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSetVideoFile(file);
  };

  const handleSetVideoFile = (file: File) => {
    setSelectedFile(file);
    setVideoPreview(URL.createObjectURL(file));
    if (!title) {
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileNameWithoutExt);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file);
      setThumbPreview(URL.createObjectURL(file));
    } else {
      toast.error("File thumbnail harus berupa gambar!");
    }
  };

  const handleRemoveThumb = () => {
    setThumbnailFile(null);
    if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    setThumbPreview(null);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Silakan pilih file video terlebih dahulu.");
      return;
    }
    setShowConfirmDialog(true);
  };

  // Eksekusi API Upload
  const executeUpload = async () => {
    setShowConfirmDialog(false);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (source) formData.append("source", source);
    if (tags) formData.append("tagIds", tags);
    formData.append("video", selectedFile as Blob);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile as Blob);
    }

    try {
      const xhr = new XMLHttpRequest();
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          setIsUploading(false);

          if (xhr.status >= 200 && xhr.status < 300) {
            setIsSuccess(true);
            toast.success("Video berhasil diunggah!");
          } else {
            let errorMsg = "Gagal mengunggah video.";
            try {
              const res = JSON.parse(xhr.responseText);
              errorMsg = res.message || errorMsg;
            } catch {}
            toast.error(errorMsg);
          }
        }
      };

      xhr.open("POST", `${API_URL}/videos/upload`);
      xhr.send(formData);
    } catch (error: any) {
      setIsUploading(false);
      toast.error("Terjadi kesalahan jaringan atau server.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSource("");
    setTags("");
    handleRemoveFile();
    handleRemoveThumb();
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header
        center={
          <h1 className="text-base font-semibold tracking-tight">
            Upload Video
          </h1>
        }
        right={
          <>
            {!isSuccess && (
              <Button
                type="button"
                onClick={handlePreSubmit}
                disabled={!selectedFile || !title.trim() || isUploading}
              >
                {isUploading ? "Mengunggah..." : "Publish"}
              </Button>
            )}
          </>
        }
      />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16">
        {isSuccess ? (
          /* State saat Sukses */
          <Card className="p-8 text-center border-dashed">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold">Video Berhasil Diunggah!</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Video kamu telah diproses dan berhasil tersimpan di server.
              </p>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={resetForm}>
                  Upload Video Lain
                </Button>
                <Button>
                  <Link href="/">Ke Halaman Utama</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Form Upload */
          <form onSubmit={handlePreSubmit} className="space-y-8">
            {/* Metadata Section */}
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Judul Video <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Tambahkan judul yang menarik..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  placeholder="Ceritakan singkat tentang video kamu..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                />
              </div>

              {/* Tags & Source Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Source */}
                <div className="space-y-2">
                  <Label
                    htmlFor="source"
                    className="text-sm font-medium flex items-center gap-1.5"
                  >
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />{" "}
                    Source
                  </Label>
                  <Input
                    id="source"
                    type="url"
                    placeholder="https://example.com/video-source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    disabled={isUploading}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label
                    htmlFor="tags"
                    className="text-sm font-medium flex items-center gap-1.5"
                  >
                    <Tag className="h-4 w-4 text-muted-foreground" /> Tag
                    (Pisahkan dengan koma)
                  </Label>
                  <Input
                    id="tags"
                    placeholder="react, nextjs, tutorial"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Custom Thumbnail (Opsional) */}
              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />{" "}
                  Thumbnail Custom (Opsional)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Jika dikosongkan, thumbnail akan di-generate otomatis dari
                  frame video.
                </p>

                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbSelect}
                  className="hidden"
                  disabled={isUploading}
                />

                {!thumbnailFile ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => thumbInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    Pilih Gambar Thumbnail
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative aspect-video h-16 rounded-md overflow-hidden bg-muted border">
                      {thumbPreview && (
                        <img
                          src={thumbPreview}
                          alt="Thumbnail Preview"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium truncate max-w-50">
                        {thumbnailFile.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveThumb}
                        className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10"
                        disabled={isUploading}
                      >
                        Hapus Thumbnail
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* File Video Upload / Drag Zone */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                File Video <span className="text-destructive">*</span>
              </Label>

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">
                    Tarik & Lepas file video di sini
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Atau klik untuk memilih file dari komputer (MP4, WebM, MOV)
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    className="mt-4"
                  >
                    Pilih File
                  </Button>
                </div>
              ) : (
                /* Card Preview Video yang Dipilih */
                <Card className="relative overflow-hidden bg-muted/30">
                  <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-start">
                    {/* Video Player Preview */}
                    <div className="relative aspect-video w-full md:w-64 rounded-xl overflow-hidden bg-black shrink-0">
                      {videoPreview && (
                        <video
                          src={videoPreview}
                          controls
                          className="h-full w-full object-contain"
                        />
                      )}
                    </div>

                    {/* File Info & Upload Progress */}
                    <div className="flex-1 space-y-2 w-full min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <FileVideo className="h-5 w-5 text-primary shrink-0" />
                          <span className="font-medium text-sm truncate">
                            {selectedFile.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveFile}
                          disabled={isUploading}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Ukuran: {(selectedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                        MB
                      </p>

                      {/* Progress Bar saat proses upload */}
                      {isUploading && (
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Mengunggah...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </form>
        )}
      </main>

      {/* AlertDialog Konfirmasi Publish */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Unggah Video</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mempublikasikan video{" "}
              <strong className="text-foreground">{title}</strong>?
              {!thumbnailFile && (
                <span className="block mt-2 text-xs text-amber-600 dark:text-amber-400">
                  * Thumbnail akan dibuat otomatis dari frame detik ke-1 video.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeUpload}>
              Ya, Publikasikan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

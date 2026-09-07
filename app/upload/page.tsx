"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  X,
  FileVideo,
  CheckCircle2,
  Tag,
  Link as LinkIcon,
} from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Harap unggah file berformat video (MP4, WebM, dll).");
      return;
    }
    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, "")); // Auto fill title dari nama file
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setTitle("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Simulasi Submit / Upload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulation progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsSuccess(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        center={
          <h1 className="text-base font-semibold tracking-tight">
            Upload Video
          </h1>
        }
        right={
          <Button type="submit" disabled={!selectedFile || isUploading}>
            {isUploading ? "Mengunggah..." : "Publish"}
          </Button>
        }
      />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16">
        {isSuccess ? (
          /* State saat Sukses */
          <Card className="p-8 text-center">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold">Video Berhasil Diunggah!</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Video kamu sedang diproses dan akan segera tersedia di platform.
              </p>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Metadata Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold tracking-tight border-b pb-2">
                Informasi Detail
              </h2>

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
                  onChange={(e: any) => setDescription(e.target.value)}
                />
              </div>

              {/* Tags & Visibility Grid */}
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
                  />
                </div>
              </div>
            </div>

            {/* File Upload / Drag Zone */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">File Video</Label>
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

                    {/* File Info */}
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
    </div>
  );
}

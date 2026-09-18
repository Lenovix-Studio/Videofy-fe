"use client";

import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import {
  Upload,
  FileVideo,
  X,
  CheckCircle2,
  Tag,
  Link as LinkIcon,
  ImageIcon,
  Loader2,
  ArrowUpFromLine,
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
import { Badge } from "@/components/ui/badge";

interface TagOption {
  id: string;
  name: string;
  slug: string;
  count: number;
}

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [availableTags, setAvailableTags] = useState<TagOption[]>([]);
  const [isFetchingTags, setIsFetchingTags] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Fetch tag dengan query search dinamis + debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsFetchingTags(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const queryParams = new URLSearchParams({ limit: "20" });

        if (tagInput.trim()) {
          queryParams.append("search", tagInput.trim());
        }

        const res = await fetch(`${API_URL}/tags?${queryParams.toString()}`);
        if (res.ok) {
          const data: TagOption[] = await res.json();
          setAvailableTags(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data tag:", error);
      } finally {
        setIsFetchingTags(false);
      }
    }, 300); // Delay 300ms untuk menekan jumlah request ke API

    return () => clearTimeout(timer);
  }, [tagInput]);

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

  // Fungsi helper untuk menambah satu atau banyak tag sekaligus
  const addTags = (tagsToAdd: string[]) => {
    setSelectedTags((prev) => {
      const updated = [...prev];
      tagsToAdd.forEach((raw) => {
        const cleaned = raw.trim();
        if (
          cleaned &&
          !updated.some((t) => t.toLowerCase() === cleaned.toLowerCase())
        ) {
          updated.push(cleaned);
        }
      });
      return updated;
    });
    setTagInput("");
  };

  // Handler Event Paste (Copas)
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    // Jika teks mengandung koma atau baris baru (\n)
    if (pastedText.includes(",") || pastedText.includes("\n")) {
      e.preventDefault();
      const tagsArray = pastedText.split(/,|\n/);
      addTags(tagsArray);
    }
  };

  // Handler keyboard (Enter / Koma / Backspace)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags([tagInput]);
    } else if (e.key === "Backspace" && !tagInput && selectedTags.length > 0) {
      setSelectedTags((prev) => prev.slice(0, -1));
    }
  };

  // Handler menghapus tag yang dipilih
  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Eksekusi API Upload Video
  const executeUpload = async () => {
    setShowConfirmDialog(false);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (source) formData.append("source", source);

    if (selectedTags.length > 0) {
      formData.append("tagIds", selectedTags.join(","));
    }

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
            const DURATION = 2000;

            toast.custom(
              (t) => (
                <div className="flex w-full max-w-sm flex-col gap-2.5 rounded-lg border bg-background p-4 shadow-lg text-foreground">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium">
                      Video berhasil diunggah! Memuat ulang...
                    </p>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-emerald-500 transition-all ease-linear"
                      style={{
                        animation: `shrink ${DURATION}ms linear forwards`,
                      }}
                    />
                  </div>
                </div>
              ),
              { duration: DURATION },
            );

            setTimeout(() => {
              window.location.reload();
            }, DURATION);
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

  // Filter tag dari API yang belum dipilih di input
  const unselectedAvailableTags = availableTags.filter(
    (tag) =>
      !selectedTags.some(
        (selected) => selected.toLowerCase() === tag.name.toLowerCase(),
      ),
  );

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
                size="sm"
                onClick={handlePreSubmit}
                disabled={!selectedFile || !title.trim() || isUploading}
                className="gap-1.5 font-medium shadow-sm transition-all"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mengunggah ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpFromLine className="h-4 w-4" />
                    <span>Publish</span>
                  </>
                )}
              </Button>
            )}
          </>
        }
      />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16">
        <form onSubmit={handlePreSubmit} className="space-y-8">
          {/* Metadata Section */}
          <div className="space-y-5">
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
                className="resize-y"
              />
            </div>

            {/* Source */}
            <div className="space-y-2">
              <Label
                htmlFor="source"
                className="text-sm font-medium flex items-center gap-1.5"
              >
                <LinkIcon className="h-4 w-4 text-muted-foreground" /> Source
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

            {/* Tags Section (Full Width) */}
            <div className="space-y-2.5 pt-1">
              <Label
                htmlFor="tags"
                className="text-sm font-medium flex items-center gap-1.5"
              >
                <Tag className="h-4 w-4 text-muted-foreground" /> Tag
              </Label>

              {/* Input Box dengan Badge Terpilih */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-2 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-10.5">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 pl-2.5 pr-1 py-1 text-xs font-normal"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      disabled={isUploading}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}

                <div className="flex-1 flex items-center min-w-40">
                  <Input
                    id="tags"
                    type="text"
                    placeholder={
                      selectedTags.length === 0
                        ? "Cari atau paste tag (pisahkan koma)..."
                        : "Tambah tag..."
                    }
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    disabled={isUploading}
                    className="border-0 p-0 h-6 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none w-full bg-transparent placeholder:text-muted-foreground"
                  />
                  {isFetchingTags && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground ml-1 shrink-0" />
                  )}
                </div>
              </div>

              {/* Rekomendasi Tag dari Database */}
              {unselectedAvailableTags.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs text-muted-foreground">
                    {tagInput ? "Hasil pencarian tag:" : "Tag populer:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {unselectedAvailableTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors text-xs py-1 px-2.5 flex items-center gap-1.5 font-normal"
                        onClick={() => !isUploading && addTags([tag.name])}
                      >
                        <span>+ {tag.name}</span>
                        <span className="text-[10px] opacity-70 bg-muted px-1.5 py-0.2 rounded text-muted-foreground">
                          {tag.count}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Thumbnail Custom (Opsional)
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Jika dikosongkan, thumbnail akan dibuat otomatis dari frame awal
                video.
              </p>
            </div>

            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbSelect}
              className="hidden"
              disabled={isUploading}
            />

            {!thumbnailFile ? (
              <div
                onClick={() => !isUploading && thumbInputRef.current?.click()}
                className={`group flex items-center gap-3 rounded-xl border-2 border-dashed p-3 transition-all cursor-pointer ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    Unggah Gambar Custom
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Format PNG, JPG, WebP (Maks 5MB)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isUploading}
                  className="shrink-0 h-8 text-xs font-medium"
                >
                  Pilih Gambar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm">
                <div className="relative aspect-video h-14 rounded-lg overflow-hidden bg-black/10 border shrink-0">
                  {thumbPreview && (
                    <img
                      src={thumbPreview}
                      alt="Thumbnail Preview"
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold truncate text-foreground">
                      {thumbnailFile.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveThumb}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                  disabled={isUploading}
                  title="Hapus Thumbnail"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <FileVideo className="h-4 w-4 text-primary" />
              File Video <span className="text-destructive">*</span>
            </Label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[0.99]"
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
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  Tarik & Lepas file video di sini
                </h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                  Format yang didukung: MP4, WebM, MOV, atau MKV
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  className="mt-5 font-medium shadow-sm"
                >
                  Pilih File Dari Komputer
                </Button>
              </div>
            ) : (
              <Card className="relative overflow-hidden border bg-card/80 backdrop-blur-sm shadow-md transition-all">
                <CardContent className="p-1 sm:px-4 flex flex-col md:flex-row gap-5 items-start">
                  <div className="relative aspect-video w-full md:w-110 rounded-xl overflow-hidden bg-black shadow-inner shrink-0 group">
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="h-full w-full object-contain"
                      />
                    )}
                    {thumbPreview && (
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                        <ImageIcon className="h-3 w-3 text-emerald-400" />
                        <span>Thumbnail Diterapkan</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary animate-pulse shrink-0" />
                          <h4
                            className="font-semibold text-sm truncate text-foreground"
                            title={selectedFile.name}
                          >
                            {selectedFile.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-medium text-[11px]">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                          <span>•</span>
                          <span className="uppercase text-[11px] font-medium">
                            {selectedFile.name.split(".").pop()}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        disabled={isUploading}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                        title="Hapus Video"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {isUploading ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-primary flex items-center gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Mengunggah ke server...
                          </span>
                          <span className="text-foreground">
                            {uploadProgress}%
                          </span>
                        </div>
                        <Progress
                          value={uploadProgress}
                          className="h-2 rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="pt-1 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Video siap dipublikasikan</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </form>
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

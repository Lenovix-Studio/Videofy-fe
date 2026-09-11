"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/header";
import {
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Save,
  Link as LinkIcon,
  Tag,
  ImageIcon,
  Upload,
  FileVideo,
} from "lucide-react";
import { getMediaUrl } from "@/lib/helper";
import { toast } from "sonner";

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState("");
  const [existingVideoUrl, setExistingVideoUrl] = useState("");
  const [existingThumbUrl, setExistingThumbUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch Existing Video Data
  useEffect(() => {
    if (!videoId) return;

    async function fetchVideoData() {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:3001/videos/${videoId}`);
        if (!res.ok) throw new Error("Gagal mengambil data video.");

        const data = await res.json();
        const formattedTags = Array.isArray(data.tags)
          ? data.tags
              .map((t: any) => (typeof t === "string" ? t : t.name))
              .filter(Boolean)
              .join(", ")
          : data.tags || "";

        setTitle(data.title || "");
        setDescription(data.description || "");
        setSource(data.source || "");
        setTags(formattedTags);
        setExistingVideoUrl(getMediaUrl(data.videoUrl) || "");
        setExistingThumbUrl(getMediaUrl(data.thumbnailUrl) || "");
        setThumbPreview(getMediaUrl(data.thumbnailUrl) || null);
        setVideoPreview(getMediaUrl(data.videoUrl) || null);
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan saat memuat data video.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    return () => {
      if (videoPreview && videoPreview !== existingVideoUrl) {
        URL.revokeObjectURL(videoPreview);
      }
      if (thumbPreview && thumbPreview !== existingThumbUrl) {
        URL.revokeObjectURL(thumbPreview);
      }
    };
  }, [videoPreview, thumbPreview, existingVideoUrl, existingThumbUrl]);

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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedVideo(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedVideo(files[0]);
    }
  };

  const processSelectedVideo = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Harap pilih file video yang valid!");
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleRemoveFile = () => {
    if (selectedFile && videoPreview && videoPreview !== existingVideoUrl) {
      URL.revokeObjectURL(videoPreview);
    }
    setSelectedFile(null);
    setVideoPreview(existingVideoUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("Harap pilih file gambar yang valid!");
        return;
      }
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbPreview(url);
    }
  };

  const handleRemoveThumb = () => {
    if (thumbnailFile && thumbPreview && thumbPreview !== existingThumbUrl) {
      URL.revokeObjectURL(thumbPreview);
    }
    setThumbnailFile(null);
    setThumbPreview(existingThumbUrl || null);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  // Handle UPDATE Data video
  const handlePreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("source", source);
      formData.append("tags", tags);

      if (selectedFile) {
        formData.append("video", selectedFile);
      }
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          setIsUploading(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            setIsSuccess(true);
          } else {
            try {
              const errorData = JSON.parse(xhr.response);

              const customMessage =
                errorData.message && errorData.message[0]
                  ? errorData.message[0]
                  : "Terjadi kesalahan pada server.";

              toast.error(customMessage);
            } catch (e) {
              toast.error("Gagal memproses data dari server.");
            }
          }
        }
      };

      xhr.open("PUT", `http://localhost:3001/videos/${videoId}`);
      xhr.send(formData);
    } catch (err: any) {
      setIsUploading(false);
      toast.error(err.message || "Gagal mengupdate video.");
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Memuat data video...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        left={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground transition"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
        }
        center={
          <div className="flex flex-col items-center justify-center text-center max-w-50 sm:max-w-100">
            <h1 className="text-sm sm:text-base font-semibold tracking-tight leading-none">
              Edit Video
            </h1>
            {videoId && (
              <span
                className="mt-1 block max-w-full truncate font-mono text-[10px] text-muted-foreground select-all bg-muted px-1.5 py-0.5 rounded"
                title={videoId}
              >
                {videoId}
              </span>
            )}
          </div>
        }
        right={
          <Button
            type="submit"
            size="sm"
            className="gap-1.5 shadow-sm"
            onClick={handlePreSubmit}
            disabled={isUploading} // Buat state [isSaving, setIsSaving] = useState(false) saat fetch POST/PUT
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
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
              <h2 className="text-2xl font-bold">Video Berhasil Diperbarui!</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Perubahan pada video kamu telah berhasil disimpan di server.
              </p>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
                  Edit Lagi
                </Button>
                <Button>
                  <Link href={`/watch/${videoId}`}>Lihat Video</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Form Edit Video */
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

              {/* Custom Thumbnail */}
              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" /> Gambar
                  Thumbnail
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pilih gambar baru jika ingin mengganti thumbnail yang ada.
                </p>

                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbSelect}
                  className="hidden"
                  disabled={isUploading}
                />

                {!thumbPreview ? (
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
                      <img
                        src={thumbPreview}
                        alt="Thumbnail Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium truncate max-w-50">
                        {thumbnailFile
                          ? thumbnailFile.name
                          : "Thumbnail Saat Ini"}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => thumbInputRef.current?.click()}
                          className="h-6 px-2 text-xs"
                          disabled={isUploading}
                        >
                          Ganti
                        </Button>
                        {thumbnailFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveThumb}
                            className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10"
                            disabled={isUploading}
                          >
                            Kembalikan Semula
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* File Video Section */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">File Video</Label>
              <p className="text-xs text-muted-foreground">
                Abaikan area ini jika tidak ingin mengubah file video yang sudah
                ada.
              </p>

              {/* Pindahkan input file ke sini agar selalu ada di DOM */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!selectedFile && !videoPreview ? (
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted pointer-events-none">
                    <Upload className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold pointer-events-none">
                    Tarik & Lepas file video baru di sini
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground pointer-events-none">
                    Atau klik untuk memilih file pengganti dari komputer
                  </p>
                  <div className="mt-4 inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground text-sm font-medium h-9 px-3 hover:bg-secondary/80 pointer-events-none">
                    Pilih File Baru
                  </div>
                </div>
              ) : (
                /* Preview Video (Satu untuk Video Baru / Video Lama) */
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
                            {selectedFile
                              ? selectedFile.name
                              : "Video Saat Ini (Server)"}
                          </span>
                        </div>
                        {/* Tombol Ganti File sekarang berfungsi karena input sudah ada di DOM */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
                          title="Ganti file video"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {selectedFile
                          ? `Ukuran Baru: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                          : "Menggunakan video yang tersimpan saat ini."}
                      </p>

                      {selectedFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10"
                          disabled={isUploading}
                        >
                          Batalkan Perubahan Video
                        </Button>
                      )}

                      {/* Progress Bar saat proses upload */}
                      {isUploading && (
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Menyimpan perubahan...</span>
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

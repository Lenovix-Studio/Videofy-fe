"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/lib/constant";
import { toast } from "sonner";

export function RandomVideoButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomVideo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/videos/random`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Gagal mengambil video acak");
      }
      const data = await res.json();
      if (data && data.id) {
        router.push(`/watch/${data.id}`);
      } else {
        toast.error("Tidak ada video yang tersedia");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Terjadi kesalahan");
      } else {
        toast.error("Terjadi kesalahan");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="rounded-full px-4 text-muted-foreground hover:text-foreground font-medium flex items-center gap-2"
      onClick={handleRandomVideo}
      disabled={isLoading}
      title="Putar Video Acak"
    >
      <Shuffle className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      <span className="hidden sm:inline">Acak</span>
    </Button>
  );
}

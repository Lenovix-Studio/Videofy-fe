import { FileQuestion } from "lucide-react";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground shadow-sm">
            <FileQuestion className="h-8 w-8" />
          </div>

          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Video Tidak Ditemukan
          </h2>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Video yang Anda cari kemungkinan telah dihapus, dipindahkan, atau
            tautan yang Anda masukkan salah.
          </p>
        </div>
      </main>
    </div>
  );
}

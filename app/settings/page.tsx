"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Settings,
  Trash2,
  RotateCcw,
  Heart,
  History,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function SettingsPage() {
  const [isResetting, setIsResetting] = useState(false);

  // Reset API
  const handleResetDatabase = async () => {
    setIsResetting(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      const response = await fetch(`${API_URL}/system/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal melakukan reset database.");
      }

      localStorage.clear();
      sessionStorage.clear();

      toast.success("Database dan sistem berhasil direset ke kondisi awal!");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat mereset database.");
    } finally {
      setIsResetting(false);
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        center={
          <div className="flex items-center gap-3 ">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10 text-slate-500">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            </div>
          </div>
        }
      />
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:pl-52 pt-20 pb-12 px-4 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-6">
            {/* Card Hapus Data Spesifik */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-muted-foreground" />
                  Pembersihan Data Pengguna
                </CardTitle>
                <CardDescription>
                  Hapus data aktivitas tertentu tanpa mempengaruhi akun atau
                  data lainnya.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Option: Clear Favorites */}
                <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500" /> Hapus Semua
                      Favorit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Menghapus seluruh video yang telah kamu tandai sebagai
                      favorit.
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" /> Hapus
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Hapus Semua Favorit?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini akan mengosongkan seluruh daftar video
                          favorit kamu. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Hapus Favorit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Option: Clear History */}
                <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <History className="h-4 w-4 text-blue-500" /> Hapus
                      Riwayat Tontonan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Menghapus seluruh riwayat video yang pernah kamu tonton.
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" /> Hapus
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Hapus Riwayat Tontonan?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Seluruh catatan riwayat tontonan kamu akan
                          dibersihkan. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Hapus Riwayat
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone: Reset Database */}
            <Card className="border-destructive/40 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Danger Zone: Reset
                  Database
                </CardTitle>
                <CardDescription>
                  Kembalikan seluruh data aplikasi ke kondisi awal (default).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-destructive/20 bg-background p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-destructive">
                      Reset Semua Data & Database Lokal
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Aksi ini akan menghapus seluruh data favorit, riwayat,
                      preferensi, serta cache lokal secara permanen.
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2 shrink-0"
                          disabled={isResetting}
                        />
                      }
                    >
                      {isResetting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                      {isResetting ? "Mereset..." : "Reset Database"}
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" /> Konfirmasi Reset
                          Database
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah kamu yakin ingin mereset seluruh database dan
                          cache lokal? Seluruh data yang tersimpan akan hilang
                          secara permanen dan tindakan ini tidak dapat
                          dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isResetting}>
                          Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleResetDatabase}
                          disabled={isResetting}
                          className="bg-destructive text-accent hover:bg-destructive/90 gap-2"
                        >
                          {isResetting && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          Ya, Reset Sekarang
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

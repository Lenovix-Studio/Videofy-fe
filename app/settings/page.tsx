"use client";

import { useState } from "react";
import {
  Settings,
  Trash2,
  RotateCcw,
  Heart,
  History,
  Database,
  CheckCircle2,
  AlertTriangle,
  User,
} from "lucide-react";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "data">("data");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Handlers untuk Aksi
  const handleClearFavorites = () => {
    // Logika hapus favorite (e.g., localStorage / API Call)
    localStorage.removeItem("favorites");
    showStatus("Seluruh daftar favorit berhasil dihapus!");
  };

  const handleClearHistory = () => {
    // Logika hapus history (e.g., localStorage / API Call)
    localStorage.removeItem("history");
    showStatus("Seluruh riwayat tontonan berhasil dibersihkan!");
  };

  const handleResetDatabase = () => {
    // Logika reset database / local cache
    localStorage.clear();
    showStatus("Database lokal dan cache berhasil direset ke pengaturan awal!");
  };

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
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
          {/* Page Header */}

          {/* Toast / Alert Status Notification */}
          {statusMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "data" ? "default" : "ghost"}
              size="lg"
              onClick={() => setActiveTab("data")}
              className="rounded-full gap-2 p-5"
            >
              <Database className="h-4 w-4" /> Management Data
            </Button>
            <Button
              variant={activeTab === "general" ? "default" : "ghost"}
              size="lg"
              onClick={() => setActiveTab("general")}
              className="rounded-full gap-2 p-5"
            >
              <User className="h-4 w-4" /> Profil & Umum
            </Button>
          </div>

          {/* TAB 1: DATA MANAGEMENT & RESET ZONE */}
          {activeTab === "data" && (
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
                          <AlertDialogAction
                            onClick={handleClearFavorites}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
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
                          <AlertDialogAction
                            onClick={handleClearHistory}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
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
                          >
                            <RotateCcw className="h-4 w-4" /> Reset Database
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" /> Konfirmasi
                            Reset Database
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah kamu yakin ingin mereset seluruh database dan
                            cache lokal? Seluruh data yang tersimpan akan hilang
                            secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleResetDatabase}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Ya, Reset Sekarang
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: PROFIL & UMUM */}
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pengaturan Profil</CardTitle>
                <CardDescription>
                  Ubah preferensi identitas pengguna
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nama Pengguna</Label>
                  <Input id="username" defaultValue="Kamil Sudarmi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="kamil@example.com"
                  />
                </div>
                <Button className="mt-2">Simpan Perubahan</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

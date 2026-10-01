import { PlaylistClientView } from "./PlaylistClientView";
import { BACKEND_URL } from "@/lib/constant";
import { Playlist } from "@/types/playlist";

export default async function PlaylistsPage() {
  let playlists: Playlist[] = [];

  try {
    const res = await fetch(`${BACKEND_URL}/playlists`, { cache: "no-store" });
    if (res.ok) {
      playlists = await res.json();

      playlists = playlists.map((p: any) => ({
        ...p,
        stats: {
          totalVideos: p._count?.items || 0,
          totalPhotos: 0,
        },
      }));
    }
  } catch (err) {
    console.error("Gagal memuat playlists", err);
  }

  return <PlaylistClientView initialPlaylists={playlists} />;
}

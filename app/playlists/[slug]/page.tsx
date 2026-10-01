import {
  PlaylistDetailClientView,
  PlaylistItem,
} from "./PlaylistDetailClientView";
import { BACKEND_URL } from "@/lib/constant";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PlaylistDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let playlistTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let items: PlaylistItem[] = [];
  let playlistId = "";

  try {
    const res = await fetch(`${BACKEND_URL}/playlists/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const playlist = await res.json();
      playlistTitle = playlist.title;
      playlistId = playlist.id;

      if (playlist.items && playlist.items.length > 0) {
        items = playlist.items.map((item: any) => ({
          id: item.type === "video" ? item.videoId : item.photoId,
          type: item.type,
          title: item.type === "video" ? item.video?.title : item.photo?.title,
          thumbnailUrl:
            item.type === "video"
              ? item.video?.thumbnailUrl
              : item.photo?.photoUrl,
          duration: item.type === "video" ? "10:00" : undefined,
          createdAt: new Date(item.addedAt).toISOString().split("T")[0],
          playlistItemId: item.id,
        }));
      } else {
        items = [];
      }
    } else if (res.status === 404) {
      return notFound();
    }
  } catch (err) {
    console.error("Gagal memuat detail playlist", err);
  }

  return (
    <PlaylistDetailClientView
      slug={slug}
      playlistId={playlistId}
      playlistTitle={playlistTitle}
      initialItems={items}
    />
  );
}

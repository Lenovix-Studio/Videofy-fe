import notFound from "@/app/not-found";
import { BACKEND_URL } from "@/lib/constant";
import { RelatedVideo, VideoDetail } from "@/lib/types";
import { WatchClientView } from "./WatchClientView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    list?: string;
  }>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const videoId = resolvedParams.id;
  const listId = resolvedSearchParams.list;

  let currentVideo: VideoDetail | null = null;
  let relatedVideos: RelatedVideo[] = [];
  let userPlaylists: any[] = [];
  let playlistQueue: any = null;

  try {
    const fetchPromises: Promise<any>[] = [
      fetch(`${BACKEND_URL}/videos/${videoId}`, { cache: "no-store" }),
      fetch(`${BACKEND_URL}/videos/${videoId}/related`, { cache: "no-store" }),
      fetch(`${BACKEND_URL}/playlists`, { cache: "no-store" }),
    ];

    if (listId) {
      fetchPromises.push(fetch(`${BACKEND_URL}/playlists/${listId}`, { cache: "no-store" }));
    }

    const [detailRes, relatedRes, playlistsRes, queueRes] = await Promise.all(fetchPromises);

    if (!detailRes.ok) {
      return notFound();
    }

    currentVideo = await detailRes.json();
    
    if (relatedRes.ok) {
      relatedVideos = await relatedRes.json();
    }

    if (playlistsRes.ok) {
      userPlaylists = await playlistsRes.json();
    }

    if (queueRes && queueRes.ok) {
      playlistQueue = await queueRes.json();
    }
  } catch (err) {
    return notFound();
  }

  if (!currentVideo) {
    return notFound();
  }

  return (
    <WatchClientView 
      videoId={videoId} 
      listId={listId} 
      initialVideo={currentVideo} 
      initialRelatedVideos={relatedVideos}
      userPlaylists={userPlaylists}
      playlistQueue={playlistQueue}
    />
  );
}

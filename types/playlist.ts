export interface PlaylistItemSummary {
  totalVideos: number;
  totalPhotos: number;
}

export interface Playlist {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    items: number;
  };
  // Array of items (up to 4 for collage)
  items?: Array<{
    id: string;
    videoId?: string | null;
    type: string;
    video?: { thumbnailUrl: string } | null;
    photo?: { photoUrl: string } | null;
  }>;
  // Mendukung penghitungan terpisah video & foto
  stats?: PlaylistItemSummary;
}

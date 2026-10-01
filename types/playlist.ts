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
  // Mendukung penghitungan terpisah video & foto
  stats?: PlaylistItemSummary;
}

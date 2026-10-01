// Tags Page
export interface TagItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Upload Page
export interface TagOption {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Watch Page
export interface Tag {
  id: string;
  name: string;
  slug: string;
}
export interface VideoDetail {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string;
  filePath: string;
  thumbnailPath: string;
  fileName: string;
  duration: number;
  size: number;
  mimeType: string;
  uploader: string;
  views: number;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: Tag[];
}
export interface RelatedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
}

// History Page
export interface HistoryVideo {
  id: string;
  historyId: string;
  title: string;
  thumbnail: string;
  duration: string;
  watchedAt: string;
}
export interface HistoryGroup {
  group: string;
  videos: HistoryVideo[];
}
export interface Meta {
  totalVideos: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

// Favorite Page
export interface VideoFavorite {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  date: string;
}
export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

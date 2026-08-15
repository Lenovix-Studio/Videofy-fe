"use client";

import Link from "next/link";
import {
  Film,
  Home,
  Heart,
  Tags,
  Search,
  Play,
  MoreVertical,
  Upload,
} from "lucide-react";

const videos = [
  {
    id: "1",
    title: "My First Video",
    description: "A collection of memories and moments.",
    duration: "12:34",
    views: 128,
    date: "2 days ago",
    thumbnail:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Weekend Adventure",
    description: "A little adventure from the weekend.",
    duration: "08:21",
    views: 94,
    date: "5 days ago",
    thumbnail:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "Summer Memories",
    description: "Some of my favorite summer moments.",
    duration: "21:45",
    views: 245,
    date: "1 week ago",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    title: "Travel Journal",
    description: "A short travel journal.",
    duration: "15:12",
    views: 176,
    date: "2 weeks ago",
    thumbnail:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    title: "Random Moments",
    description: "Random clips collected over time.",
    duration: "06:47",
    views: 83,
    date: "3 weeks ago",
    thumbnail:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    title: "Project Showcase",
    description: "A showcase of one of my projects.",
    duration: "18:30",
    views: 312,
    date: "1 month ago",
    thumbnail:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="flex h-full items-center gap-6 px-4 lg:px-6">
          {/* Logo */}
          <div className="flex w-52 shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-zinc-950">
              <Film size={20} strokeWidth={2.5} />
            </div>

            <span className="text-xl font-bold tracking-tight">Videofy</span>
          </div>

          {/* Search */}
          <div className="flex max-w-2xl flex-1">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                placeholder="Search videos..."
                className="h-10 w-full rounded-full border border-zinc-700 bg-zinc-900 pl-11 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500"
              />
            </div>
          </div>

          {/* Upload */}
          <Link
            href="/upload"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            title="Upload video"
          >
            <Upload size={21} />
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed bottom-0 left-0 top-16 hidden w-52 border-r border-zinc-800 bg-zinc-950 lg:block">
          <nav className="flex h-full flex-col px-3 py-5">
            <div className="space-y-1">
              <SidebarItem icon={<Home size={19} />} label="Home" active />

              <SidebarItem icon={<Heart size={19} />} label="Favorites" />
            </div>

            <div className="my-5 border-t border-zinc-800" />

            <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Library
            </div>

            <div className="space-y-1">
              <SidebarItem icon={<Tags size={19} />} label="Tags" />
            </div>

            <div className="mt-auto border-t border-zinc-800 pt-4">
              <p className="px-3 text-xs leading-5 text-zinc-600">
                Videofy
                <br />
                Personal video library
              </p>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="w-full lg:ml-52">
          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
            {/* Page heading */}
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  My Videos
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                  Your personal video collection
                </p>
              </div>

              <div className="text-sm text-zinc-500">
                {videos.length} videos
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur lg:hidden">
        <nav className="flex h-16 items-center justify-around">
          <MobileNavItem icon={<Home size={20} />} label="Home" active />

          <MobileNavItem icon={<Heart size={20} />} label="Favorites" />

          <MobileNavItem icon={<Tags size={20} />} label="Tags" />
        </nav>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-1 text-xs ${
        active ? "text-white" : "text-zinc-500"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function VideoCard({
  video,
}: {
  video: {
    id: string;
    title: string;
    description: string;
    duration: string;
    views: number;
    date: string;
    thumbnail: string;
  };
}) {
  return (
    <article className="group min-w-0">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
          <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
            <Play size={20} fill="currentColor" className="ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {video.duration}
        </span>
      </div>

      {/* Information */}
      <div className="mt-3 flex gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-100 transition group-hover:text-white">
            {video.title}
          </h2>

          <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
            {video.description}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {video.views.toLocaleString()} views · {video.date}
          </p>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </article>
  );
}

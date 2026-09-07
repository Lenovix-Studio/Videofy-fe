"use client";

import Link from "next/link";
import {
  Home,
  Heart,
  Tags,
  Play,
  MoreVertical,
  Bookmark,
  Share2,
  Trash2,
  Compass,
  History,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/header";
import { usePathname } from "next/navigation";

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  date: string;
  thumbnail: string;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

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
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Main Container */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed bottom-0 left-0 top-16 hidden w-52 border-r bg-background lg:block">
          <nav className="flex h-full flex-col justify-between p-3 overflow-y-auto">
            <div className="space-y-6">
              {/* Main Section */}
              <div className="space-y-1">
                <SidebarItem
                  href="/"
                  icon={<Home className="h-4 w-4" />}
                  label="Home"
                />
                <SidebarItem
                  href="/explore"
                  icon={<Compass className="h-4 w-4" />}
                  label="Explore"
                />
              </div>

              <Separator />

              {/* Library / Personal Collection */}
              <div>
                <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Library
                </div>
                <div className="space-y-1">
                  <SidebarItem
                    href="/favorites"
                    icon={<Heart className="h-4 w-4" />}
                    label="Favorites"
                  />
                  <SidebarItem
                    href="/history"
                    icon={<History className="h-4 w-4" />}
                    label="History"
                  />
                </div>
              </div>

              <Separator />

              {/* Organize Section */}
              <div>
                <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Organize
                </div>
                <div className="space-y-1">
                  <SidebarItem
                    href="/tags"
                    icon={<Tags className="h-4 w-4" />}
                    label="Tags & Genres"
                  />
                </div>
              </div>
            </div>

            {/* Footer / Settings Section (Paling Bawah) */}
            <div className="pt-4 border-t space-y-1">
              <SidebarItem
                href="/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
              />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:ml-52">
          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
            {/* Video Grid */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur lg:hidden">
        <nav className="flex h-16 items-center justify-around">
          <MobileNavItem
            icon={<Home className="h-5 w-5" />}
            label="Home"
            active
          />
          <MobileNavItem
            icon={<Heart className="h-5 w-5" />}
            label="Favorites"
          />
          <MobileNavItem icon={<Tags className="h-5 w-5" />} label="Tags" />
        </nav>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, href }: SidebarItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-secondary text-secondary-foreground font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
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
    <Button
      variant="ghost"
      size="sm"
      className={`flex h-auto flex-col items-center gap-1 p-2 ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Button>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <Card className="group overflow-hidden border-none bg-transparent shadow-none">
      <Link href={`/watch/${video.id}`} className="block">
        <CardContent className="p-0">
          {/* Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
              <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </div>
            </div>

            {/* Duration Badge */}
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
              {video.duration}
            </span>
          </div>

          {/* Video Details */}
          <div className="mt-3 flex gap-3 px-3 pb-2">
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-sm font-semibold leading-5 transition group-hover:text-primary">
                {video.title}
              </h2>

              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {video.description}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {video.views.toLocaleString()} views · {video.date}
              </p>
            </div>

            {/* Context Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="gap-2">
                  <Bookmark className="h-4 w-4" /> Favorite
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

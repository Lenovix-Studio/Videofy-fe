"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, History, Tags, Settings } from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SidebarItem({ href, icon, label }: SidebarItemProps) {
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

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-16 hidden w-52 border-r bg-background lg:block">
      <nav className="flex h-full flex-col justify-between overflow-y-auto p-3">
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
        <div className="border-t pt-4 space-y-1">
          <SidebarItem
            href="/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
          />
        </div>
      </nav>
    </aside>
  );
}

import { ReactNode } from "react";
import Link from "next/link";
import { Film, Search, Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Header({ left, center, right, className = "" }: HeaderProps) {
  const defaultLeft = (
    <div className="flex w-52 shrink-0 items-center gap-2">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Film className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">Videofy</span>
      </Link>
    </div>
  );

  const defaultCenter = (
    <div className="flex max-w-2xl flex-1">
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search videos..."
          className="h-10 w-full rounded-full bg-muted/50 pl-10 pr-4 text-sm focus-visible:ring-1"
        />
      </div>
    </div>
  );

  const defaultRight = (
    <Button variant="ghost" size="icon" className="rounded-full">
      <Link href="/upload" title="Upload video">
        <Upload className="h-5 w-5" />
      </Link>
    </Button>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 ${className}`}
    >
      <div className="flex h-full items-center justify-between gap-6 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">{left ?? defaultLeft}</div>

        {/* Center */}
        <div className="flex flex-1 items-center justify-center">
          {center ?? defaultCenter}
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-2">
          {right ?? defaultRight}
        </div>
      </div>
    </header>
  );
}

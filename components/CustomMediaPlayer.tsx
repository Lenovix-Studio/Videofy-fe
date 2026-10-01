"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  PictureInPicture,
  PictureInPicture2,
  Loader2,
  Gauge
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomMediaPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

export function CustomMediaPlayer({
  src,
  poster,
  autoPlay = false,
}: CustomMediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPercent, setHoverPercent] = useState<number>(0);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const skipTime = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        videoRef.current.duration || 0,
      );
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const adjustVolume = useCallback(
    (delta: number) => {
      if (!videoRef.current) return;
      const newVol = Math.min(Math.max(volume + delta, 0), 1);
      setVolume(newVol);
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    },
    [volume],
  );

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  }, []);

  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (err) {
      console.error("PiP error:", err);
    }
  }, []);

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  // Reset state when src changes
  useEffect(() => {
    setIsPlaying(autoPlay);
    setIsWaiting(false);
    setCurrentTime(0);
    setDuration(0);
    setHoverTime(null);
  }, [src, autoPlay]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.getAttribute("contenteditable") === "true";

      if (isInputActive) return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipTime(5);
          break;
        case "ArrowUp":
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyP":
          e.preventDefault();
          togglePiP();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay, skipTime, adjustVolume, toggleFullscreen, toggleMute, togglePiP]);

  // Fullscreen & PiP Change Event Listener
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handlePiPChange = () => setIsPiP(!!document.pictureInPictureElement);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    if (videoRef.current) {
      videoRef.current.addEventListener("enterpictureinpicture", handlePiPChange);
      videoRef.current.addEventListener("leavepictureinpicture", handlePiPChange);
    }
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (videoRef.current) {
        videoRef.current.removeEventListener("enterpictureinpicture", handlePiPChange);
        videoRef.current.removeEventListener("leavepictureinpicture", handlePiPChange);
      }
    };
  }, []);

  // Auto-hide controls timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handlePlay = () => { setIsPlaying(true); setIsWaiting(false); };
  const handlePause = () => setIsPlaying(false);
  const handleWaiting = () => setIsWaiting(true);
  const handlePlaying = () => setIsWaiting(false);

  // Update Progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };
  
  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
    setHoverPercent(percent);
    setHoverTime(percent * duration);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative group w-full h-full overflow-hidden rounded-xl bg-black shadow-lg border border-border select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
        setHoverTime(null);
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        onClick={togglePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        className="w-full h-full cursor-pointer object-contain"
      />

      <div
        onClick={togglePlay}
        className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-4 transition-opacity duration-300 cursor-pointer ${
          showControls || !isPlaying || isWaiting
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div />

        {!isPlaying && !isWaiting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="self-center bg-primary/90 text-primary-foreground p-4 rounded-full hover:scale-110 transition-transform shadow-lg cursor-pointer"
          >
            <Play className="h-8 w-8 fill-current ml-1" />
          </button>
        )}
        
        {isWaiting && (
           <div className="self-center bg-black/50 p-4 rounded-full">
             <Loader2 className="h-10 w-10 text-white animate-spin" />
           </div>
        )}

        <div
          className="space-y-3 cursor-default mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="relative flex items-center group/progress h-2 cursor-pointer py-1"
            onMouseMove={handleProgressHover}
            onMouseLeave={() => setHoverTime(null)}
          >
            {/* Base track */}
            <div className="absolute w-full h-1 bg-white/30 rounded-lg group-hover/progress:h-1.5 transition-all" />
            {/* Buffered track (simulated for UI consistency, could use videoRef.current.buffered) */}
            <div className="absolute h-1 bg-white/50 rounded-lg group-hover/progress:h-1.5 transition-all" style={{ width: `${duration > 0 ? Math.min(100, (currentTime / duration) * 100 + 5) : 0}%` }} />
            {/* Progress track */}
            <div className="absolute h-1 bg-primary rounded-lg group-hover/progress:h-1.5 transition-all z-10" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
            
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {/* Hover tooltip */}
            {hoverTime !== null && (
              <div 
                className="absolute bottom-4 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-mono pointer-events-none z-30"
                style={{ left: `${hoverPercent * 100}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="transition-colors hover:text-primary cursor-pointer"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => skipTime(-10)}
                className="transition-colors hover:text-primary cursor-pointer"
                title="Mundur 10s (←)"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => skipTime(10)}
                className="transition-colors hover:text-primary cursor-pointer"
                title="Maju 10s (→)"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="transition-colors hover:text-primary cursor-pointer "
                  title="Mute (M)"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5 text-destructive" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 opacity-0 group-hover/vol:w-16 group-hover/vol:opacity-100 h-1 bg-white/60 rounded-lg appearance-none cursor-pointer accent-primary transition-all duration-300"
                />
              </div>

              <span className="text-xs ml-2 font-mono text-white/90">
                {formatTime(currentTime)} <span className="text-white/50">/</span> {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="transition-colors hover:text-primary cursor-pointer flex items-center gap-1 font-mono text-xs outline-none" title="Playback Speed">
                  {playbackRate === 1 ? <Gauge className="h-4 w-4" /> : `${playbackRate}x`}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white w-32">
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <DropdownMenuItem 
                      key={rate} 
                      onClick={() => changePlaybackRate(rate)}
                      className={`cursor-pointer ${playbackRate === rate ? 'bg-white/20' : ''} hover:bg-white/30`}
                    >
                      {rate === 1 ? 'Normal' : `${rate}x`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={togglePiP}
                className="transition-colors hover:text-primary cursor-pointer hidden md:block"
                title="Picture-in-Picture (P)"
              >
                {isPiP ? <PictureInPicture2 className="h-5 w-5" /> : <PictureInPicture className="h-5 w-5" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="transition-colors hover:text-primary cursor-pointer"
                title="Fullscreen (F)"
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

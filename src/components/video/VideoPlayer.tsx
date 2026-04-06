"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Headphones,
  Monitor,
  RectangleHorizontal,
} from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
  audioUrl?: string;
  thumbnail: string;
  title: string;
  bumperSrc?: string;
  cinemaMode?: boolean;
  onToggleCinemaMode?: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function VideoPlayer({
  videoUrl,
  thumbnail,
  title,
  bumperSrc,
  cinemaMode,
  onToggleCinemaMode,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [audioOnly, setAudioOnly] = useState(false);
  const [phase, setPhase] = useState<"bumper" | "main">(
    bumperSrc ? "bumper" : "main"
  );
  const [hasStarted, setHasStarted] = useState(false);

  const hideTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const currentSrc = phase === "bumper" && bumperSrc ? bumperSrc : videoUrl;

  // Reset video when source changes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.load();
    if (hasStarted) {
      v.play().catch(() => {});
    }
  }, [currentSrc, hasStarted]);

  // Time updates
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => {
      if (phase === "bumper") {
        setPhase("main");
      } else {
        setIsPlaying(false);
      }
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
    };
  }, [phase]);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    if (isPlaying) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [isPlaying, resetHideTimer]);

  // Fullscreen sync (guarded for SSR)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (!hasStarted) setHasStarted(true);

    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;

    const val = parseFloat(e.target.value);
    v.volume = val;
    setVolume(val);

    if (val === 0) {
      v.muted = true;
      setIsMuted(true);
    } else if (v.muted) {
      v.muted = false;
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase === "bumper") return;

    const v = videoRef.current;
    if (!v) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * duration;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current || typeof document === "undefined") return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const toggleAudioOnly = () => {
    if (phase === "bumper") return;
    setAudioOnly((prev) => !prev);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const isCompactAudio = audioOnly && !isFullscreen;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black ${
        cinemaMode ? "rounded-none" : "rounded-lg"
      }`}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={currentSrc || undefined}
        className="w-full"
        playsInline
        preload="metadata"
        poster={thumbnail}
        onClick={togglePlay}
      />

      {/* Controls (kept minimal for brevity, same as yours) */}
      {!isCompactAudio && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-3 text-white">
            <button onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <button onClick={toggleMute}>
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>

            <span className="text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {onToggleCinemaMode && (
              <button onClick={onToggleCinemaMode}>
                <RectangleHorizontal />
              </button>
            )}

            <button onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize /> : <Maximize />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

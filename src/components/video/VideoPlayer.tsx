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
  setTrackAudio: (trackAudio: boolean) => void;
  bumperSrc?: string;
  cinemaMode?: boolean;
  onToggleCinemaMode?: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const VideoPlayer = ({
  videoUrl,
  thumbnail,
  title,
  bumperSrc,
  setTrackAudio,
  cinemaMode,
  onToggleCinemaMode,
}: VideoPlayerProps) => {
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
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const currentSrc = phase === "bumper" && bumperSrc ? bumperSrc : videoUrl;

  // Reset video when source changes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    if (hasStarted) {
      v.play().catch(() => {});
    }
  }, [currentSrc]);

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
    clearTimeout(hideTimeout.current);
    if (isPlaying) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimeout.current);
  }, [isPlaying]);

  // Sync fullscreen state with browser
  useEffect(() => {
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
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const toggleAudioOnly = () => {
    if (phase === "bumper") return;

    setAudioOnly((prev) => {
      const next = !prev;
      setTrackAudio(next);
      return next;
    });
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isCompactAudio = audioOnly && !isFullscreen;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none group transition-all duration-500 bg-black ${
        cinemaMode ? "rounded-none" : "rounded-lg"
      } ${isFullscreen ? "flex items-center justify-center" : ""} ${
        cinemaMode && !isCompactAudio ? "h-full" : ""
      }`}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className={`w-full transition-all duration-500 ${
          isCompactAudio
            ? "h-0 opacity-0"
            : cinemaMode
            ? "h-full object-contain"
            : "aspect-video opacity-100"
        } ${audioOnly && isFullscreen ? "opacity-0" : ""} ${
          isFullscreen ? "max-h-screen" : ""
        }`}
        playsInline
        preload="metadata"
        poster={thumbnail}
        onClick={togglePlay}
      >
        {currentSrc && <source src={currentSrc} type="video/mp4" />}
      </video>

      {/* Fullscreen audio-only overlay */}
      {audioOnly && isFullscreen && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Headphones className="w-20 h-20 text-accent" />
            <div className="absolute inset-0 animate-ping">
              <Headphones className="w-20 h-20 text-accent opacity-20" />
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-mono bg-accent/15 text-accent border border-accent/30">
            Audio Mode
          </span>
          {title && (
            <p className="text-foreground text-lg font-display mt-2">{title}</p>
          )}
        </div>
      )}

      {/* Compact audio player bar */}
      {isCompactAudio && (
        <div className="bg-card px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground text-sm font-display truncate">
                {title}
              </p>
              <p className="text-muted-foreground text-xs font-mono">
                Audio Mode
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className={`relative mb-3 cursor-pointer group/progress py-1 ${
              phase === "bumper" ? "cursor-not-allowed" : ""
            }`}
            onClick={handleSeek}
          >
            <div className="h-1.5 group-hover/progress:h-2.5 rounded-full overflow-hidden transition-all duration-200 bg-muted">
              <div
                className="h-full rounded-full relative transition-all bg-accent"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-accent opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="text-foreground hover:text-primary transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 group-hover/vol:w-20 transition-all duration-300 accent-accent h-1 cursor-pointer"
              />
            </div>
            <span className="text-muted-foreground text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex-1" />
            <button
              onClick={toggleAudioOnly}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded bg-accent/15 border border-accent/30"
              title="Switch to video"
            >
              <Monitor className="w-4 h-4" />
              Video
            </button>
          </div>
        </div>
      )}

      {/* Play overlay (before start) */}
      {!hasStarted && !isCompactAudio && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110">
            <Play className="w-9 h-9 text-primary-foreground ml-1" />
          </div>
        </div>
      )}

      {/* Bumper badge */}
      {phase === "bumper" && hasStarted && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary/80 text-primary-foreground">
          Intro
        </div>
      )}

      {/* Controls bar (video mode / fullscreen) */}
      {!isCompactAudio && (
        <div
          className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
            showControls || !isPlaying
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Progress bar */}
          <div
            className={`relative mb-3 cursor-pointer group/progress py-2 ${
              phase === "bumper" ? "cursor-not-allowed" : ""
            }`}
            onClick={handleSeek}
          >
            <div className="h-1.5 group-hover/progress:h-2.5 rounded-full overflow-hidden transition-all duration-200 bg-white/20">
              <div
                className={`h-full rounded-full relative transition-all ${
                  audioOnly ? "bg-accent" : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              >
                <div
                  className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${
                    audioOnly ? "bg-accent" : "bg-primary"
                  } opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg`}
                />
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="text-white hover:text-primary transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 transition-all duration-300 accent-primary h-1 cursor-pointer"
              />
            </div>
            <span className="text-white/60 text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex-1" />
            {phase === "main" && (
              <button
                onClick={toggleAudioOnly}
                className={`text-white hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded ${
                  audioOnly
                    ? "bg-accent/15 border border-accent/30 text-accent"
                    : ""
                }`}
                title={audioOnly ? "Switch to video" : "Switch to audio only"}
              >
                {audioOnly ? (
                  <Monitor className="w-4 h-4" />
                ) : (
                  <Headphones className="w-4 h-4" />
                )}
                {audioOnly ? "Video" : "Audio"}
              </button>
            )}
            {onToggleCinemaMode && (
              <button
                onClick={onToggleCinemaMode}
                className={`text-white hover:text-primary transition-colors ${
                  cinemaMode ? "text-primary" : ""
                }`}
                title={cinemaMode ? "Exit cinema mode" : "Cinema mode"}
              >
                <RectangleHorizontal className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

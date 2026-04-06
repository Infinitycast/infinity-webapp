"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Play, Heart, Share2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import VideoPlayer from "@/components/video/VideoPlayer";
import { CommentSection } from "@/components/video/CommentSection";
import { User } from "@/lib/auth";

export default function EpisodePage({
  episodeId,
  episode,
  user,
}: {
  episodeId: string;
  episode: any;
  user: User;
}) {
  const [loved, setLoved] = useState(false);
  const [loveCount, setLoveCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [cinemaMode, setCinemaMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theatre-mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("theatre-mode", String(cinemaMode));
  }, [cinemaMode]);

  const isCreator = user?.id === "creator-id";

  const handleLove = () => {
    if (loved) {
      setLoved(false);
      setLoveCount(loveCount - 1);
      toast.success("Removed from loved");
    } else {
      setLoved(true);
      setLoveCount(loveCount + 1);
      toast.success("Loved!");
    }
  };

  const handleDonate = () => {
    toast.success("Thank you for supporting the creator!");
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? "Removed from saved" : "Saved to your library");
  };

  const handleToggleComments = (enabled: boolean) => {
    setCommentsEnabled(enabled);
    localStorage.setItem(
      `comments-enabled-${episodeId}`,
      JSON.stringify(enabled)
    );
    toast.success(enabled ? "Comments enabled" : "Comments disabled");
  };

  useEffect(() => {
    const stored = localStorage.getItem(`comments-enabled-${episodeId}`);
    if (stored !== null) {
      setCommentsEnabled(JSON.parse(stored));
    }
  }, [episodeId]);

  console.log("episode on page", episode);

  return (
    <MainLayout user={user}>
      {/* Theatre mode */}
      {cinemaMode && (
        <div className="w-full h-[90vh] bg-black">
          <VideoPlayer
            bumperSrc="/videos/bumper.mp4"
            videoUrl={episode.video}
            thumbnail={episode.image ?? "/assets/no-image.jpg"}
            title={episode.title}
            cinemaMode={cinemaMode}
            onToggleCinemaMode={() => setCinemaMode(!cinemaMode)}
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {!cinemaMode && (
            <div className="mb-8">
              <VideoPlayer
                bumperSrc="/videos/bumper.mp4"
                videoUrl={episode.video}
                thumbnail={episode.image}
                title={episode.title}
                cinemaMode={cinemaMode}
                onToggleCinemaMode={() => setCinemaMode(!cinemaMode)}
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-12 space-y-4">
            <Link
              href={`/show/${episode.show.slug}`}
              className="text-primary hover:underline font-semibold text-lg block"
            >
              {episode.show.name}
            </Link>

            <p className="text-muted-foreground text-sm">
              Hosted by{" "}
              {episode.creators?.map((creator: any, i: number) => (
                <span key={creator.id}>
                  <Link
                    href={`/creator/${creator.id}`}
                    className="hover:text-primary underline"
                  >
                    {creator.name}
                  </Link>
                  {i < episode.creators.length - 1 && ", "}
                </span>
              ))}
            </p>

            <h1 className="text-5xl md:text-6xl font-display">
              {episode.title}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              <span>{episode.date ?? "no date"}</span>
              <span>•</span>
              <span>{episode.duration ?? "no duration"}</span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-current text-primary" />
                {loveCount.toLocaleString()} loves
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Play Episode
              </Button>

              <Button size="lg" variant="outline" onClick={handleSave}>
                <Heart
                  className={`h-5 w-5 ${
                    saved ? "fill-current text-primary" : ""
                  }`}
                />
                Save
              </Button>

              <Button size="lg" variant="outline" onClick={handleLove}>
                <Heart
                  className={`h-5 w-5 ${
                    loved ? "fill-current text-primary" : ""
                  }`}
                />
                {loved ? "Loved" : "Love"} ({loveCount.toLocaleString()})
              </Button>

              <Button size="lg" onClick={handleDonate}>
                <DollarSign className="hidden h-5 w-5" />
                Donate
              </Button>

              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <h2 className="text-3xl font-display mb-4">ABOUT THIS EPISODE</h2>
            <p>{episode.description}</p>
          </div>

          {/* Transcript */}
          <div className="hidden mb-12">
            <h2 className="text-3xl font-display mb-4">TRANSCRIPT</h2>
            <p className="whitespace-pre-line">{episode.transcript}</p>
          </div>

          {/* Comments */}
          <div className="border-t pt-12">
            <h2 className="text-3xl font-display mb-6">COMMENTS</h2>
            <CommentSection
              episodeId={episodeId || "unknown"}
              commentsEnabled={commentsEnabled}
              isCreator={isCreator}
              onToggleComments={handleToggleComments}
              user={user}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

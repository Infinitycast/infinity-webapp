"use client";

import { Play, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PodcastCardProps {
  name: string;
  host: string;
  image: string;
  category: string;
  trending?: boolean;
  listeners?: string;
  aspectRatio?: "square" | "video";
}

export const PodcastCard = ({
  name,
  host,
  image,
  category,
  trending,
  listeners,
  aspectRatio = "square",
}: PodcastCardProps) => {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div
        className={`relative overflow-hidden rounded-lg mb-3 ${
          aspectRatio === "video" ? "aspect-video" : "aspect-square"
        }`}
      >
        <img
          src={image ?? "/assets/no-image.jpg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow"
          >
            <Play className="h-6 w-6 fill-current" />
          </Button>
        </div>

        {/* Trending badge */}
        {trending && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-accent text-accent-foreground shadow-lg">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{host}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {category && (
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          )}
          {listeners && <span>{listeners} listeners</span>}
        </div>
      </div>
    </div>
  );
};

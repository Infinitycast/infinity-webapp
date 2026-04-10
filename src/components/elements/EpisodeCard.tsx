"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EpisodeCardProps {
  title: string;
  show: string;
  image: string;
  duration: string;
  date: string;
  description: string;
  episode_number: number;
  id: string;
}

export const EpisodeCard = ({
  title,
  show,
  image,
  duration,
  episode_number,
  date,
  description,
}: EpisodeCardProps) => {
  return (
    <div className="group flex gap-4 cursor-pointer hover:bg-muted/10 rounded-lg p-3 -m-3 transition-colors">
      {/* Image */}
      <div className="relative w-40 h-30 aspect-video flex-shrink-0 rounded-lg overflow-hidden">
        <div>
          <Image
            src={image ?? "/assets/no-image.jpg"}
            alt={title}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-primary/90 text-primary-foreground"
          >
            <Play className="h-5 w-5 fill-current" />
          </Button>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-background/90 text-foreground px-1.5 py-0.5 rounded text-xs font-semibold">
          {duration}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
          {episode_number ? `Episode ${episode_number} - ` : ""}
          {title}
        </h4>

        <p className="text-sm text-muted-foreground">{show}</p>

        <p className="text-sm text-muted-foreground/80 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ScrollableSectionProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  viewAllButton?: boolean;
  viewAllLink?: string;
}

export function ScrollableSection({
  children,
  title,
  description,
  icon,
  viewAllButton,
  viewAllLink,
}: ScrollableSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;

    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      return () => {
        scrollElement.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;

      const targetScroll =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative scroll-section">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span>{icon}</span>
            <h2 className="text-4xl md:text-5xl font-display mb-0">{title}</h2>
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {viewAllButton && viewAllLink && (
          <Button
            variant="outline"
            className="hidden md:flex border-border/50"
            asChild
          >
            <Link href={viewAllLink}>View All</Link>
          </Button>
        )}
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-0 z-10 h-full w-12 rounded-none bg-transparent border-0 hover:bg-black/50 text-white opacity-0 scroll-section:hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 z-10 h-full w-12 rounded-none bg-transparent border-0 hover:bg-black/50 text-white opacity-0 scroll-section:hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

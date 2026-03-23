"use client";

import Link from "next/link";
import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
//import { EpisodeCard } from "@/components/EpisodeCard";
import { Play, Heart, Share2, Bell, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/lib/auth";

export default function ShowLayout({ show, user }: { show: any; user: User }) {
  const [loved, setLoved] = useState(false);
  const [loveCount, setLoveCount] = useState(8234);
  const [saved, setSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const series = [
    {
      title: "Sample Series Name",
      episodes: [
        {
          title: "The Dawn of AGI",
          show: show.title,
          image: show.image,
          duration: "58:24",
          date: "2 days ago",
          description:
            "Exploring artificial general intelligence and what it means for humanity.",
        },
        {
          title: "Machine Learning Basics",
          show: show.title,
          image: show.image,
          duration: "45:12",
          date: "1 week ago",
          description: "Understanding the fundamentals of machine learning.",
        },
      ],
    },
  ];

  const handleLove = () => {
    setLoved((prev) => !prev);
    setLoveCount((prev) => (loved ? prev - 1 : prev + 1));
    toast.success(loved ? "Removed from loved" : "Loved!");
  };

  const handleDonate = () => {
    toast.success("Thank you for your support! (Mock donation)");
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
    toast.success(saved ? "Removed from saved" : "Saved to your library");
  };

  const handleSubscribe = () => {
    setSubscribed((prev) => !prev);
    toast.success(subscribed ? "Unsubscribed" : "Subscribed to notifications");
  };

  return (
    <MainLayout user={user}>
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={show.image}
              alt={show.title}
              className="w-64 h-64 rounded-lg object-cover"
            />

            <div className="flex-1">
              <div className="mb-4 text-sm text-primary">{show.category}</div>

              <h1 className="text-5xl font-bold mb-4">{show.name}</h1>

              <p className="mb-2">
                Hosted by{" "}
                {show.hosts.map((host: any, i: number) => {
                  return (
                    <span key={host.id}>
                      <Link
                        href={`/creator/${host.id}`}
                        className="text-primary underline"
                      >
                        {host.name}
                      </Link>
                      {i < show.hosts.length - 1 && ", "}
                    </span>
                  );
                })}
              </p>

              <p className="text-muted-foreground mb-4">
                {show.listeners ?? "0"} listeners
              </p>

              <p className="mb-6">{show.description}</p>

              <div className="flex flex-wrap gap-3">
                <Button className="hidden">
                  <Play className="mr-2 h-4 w-4" />
                  Play Latest
                </Button>

                <Button
                  className="hidden"
                  onClick={handleSubscribe}
                  variant="outline"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  {subscribed ? "Subscribed" : "Subscribe"}
                </Button>

                <Button
                  className="hidden"
                  onClick={handleSave}
                  variant="outline"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Save
                </Button>

                <Button
                  className="hidden"
                  onClick={handleLove}
                  variant="outline"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {loved ? "Loved" : "Love"} ({loveCount})
                </Button>

                <Button className="hidden" onClick={handleDonate}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Donate
                </Button>

                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="container mx-auto px-4 py-12">
        {series.map((s, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-3xl mb-6">{s.title}</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {s.episodes.map((episode) => (
                <Link
                  key={episode.title}
                  href={`/episode/${episode.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {/*<EpisodeCard {...episode} />*/}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PodcastCard } from "@/components/elements/PodcastCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Check, Crown, Lock, Radio, Calendar } from "lucide-react";
import { toast } from "sonner";
import { MainLayout } from "@/components/layouts/MainLayout";
import { User } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Footer } from "../layouts/Footer";

export default function CreatorPage({
  user,
  creator,
  isFollowing,
  followId,
}: {
  user: User;
  creator: any; // TODO: Update types once finalised.
  isFollowing: boolean;
  followId: string | undefined;
}) {
  const [following, setFollowing] = useState(isFollowing ?? false);
  const [currentFollowId, setCurrentFollowId] = useState(followId);
  const [isMember, setIsMember] = useState(false);

  const router = useRouter();

  const shows = [
    {
      title: "The Tech Revolution",
      host: creator.name,
      image:
        "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&q=80",
      category: "Technology",
      listeners: "127K",
    },
    {
      title: "AI Uncovered",
      host: creator.name,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      category: "Technology",
      listeners: "89K",
    },
  ];

  const premiumContent = [
    {
      title: "Behind the Scenes: Recording Process",
      type: "Video",
      duration: "15:30",
    },
    {
      title: "Early Access: Next Week's Episode",
      type: "Audio",
      duration: "58:24",
    },
    { title: "Exclusive Q&A Session", type: "Live Event", date: "Next Friday" },
  ];

  const membershipBenefits = [
    "Early access to all episodes (1 week before public)",
    "Exclusive behind-the-scenes content",
    "Monthly live Q&A sessions",
    "Ad-free listening experience",
    "Member-only Discord community",
    "Bonus episodes and extended interviews",
  ];

  const handleFollow = async () => {
    if (isFollowing) {
      const res = await fetch("/api/follow/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: currentFollowId,
        }),
      });

      if (!res.ok) throw new Error();

      setFollowing(false);
      setCurrentFollowId(undefined);
      toast.success("Unsubscribed successfully");
    } else {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId: creator.id,
        }),
      });

      if (!res.ok) throw new Error();

      const { followerId } = await res.json();

      setCurrentFollowId(followerId);
      setFollowing(true);
      toast.success("Subscribed successfully!");
    }
  };

  const handleMembership = () => {
    if (!isMember) {
      // Mock payment flow
      toast.success("Welcome to Premium! (Mock payment successful)");
      setIsMember(true);
    } else {
      toast.info("You're already a premium member!");
    }
  };

  return (
    <MainLayout user={user}>
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={creator.display_picture}
              alt={creator.name}
              className="w-40 h-40 rounded-full object-cover shadow-card"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-5xl md:text-6xl font-display mb-0">
                  {creator.name}
                </h1>

                {isMember && (
                  <Badge className="bg-gradient-primary text-primary-foreground border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <div>
                <div className="font-bold text-3xl mb-4">
                  @{creator.username}
                </div>
              </div>

              <p className="text-lg text-foreground mb-4">{creator.role}</p>

              <div className="flex gap-6 text-sm text-muted-foreground mb-6">
                <div>
                  <span className="font-bold text-foreground">
                    {creator.followers ?? 0}
                  </span>{" "}
                  followers
                </div>
                <div>
                  <span className="font-bold text-foreground">
                    {creator.totalShows ?? 0}
                  </span>{" "}
                  shows
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {!user ? (
                  <Button
                    size="lg"
                    onClick={() => router.push("/auth/signin")}
                    variant={"default"}
                  >
                    Sign in to follow!
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleFollow}
                    variant={following ? "outline" : "default"}
                  >
                    {following ? "Following" : "Follow"}
                  </Button>
                )}
                {false && (
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={handleMembership}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Become a Member - $5/month
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Twitch Integration */}
          {creator.twitch?.connected && (
            <div className="mt-8">
              {creator.twitch.isLive ? (
                <Card className="border-red-500/50 bg-red-500/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge className="bg-red-500 text-white animate-pulse">
                        <Radio className="h-3 w-3 mr-1 fill-current" />
                        LIVE ON TWITCH
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {creator.twitch.currentStream.viewers} viewers
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold mb-1">
                          {creator.twitch.currentStream.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {creator.twitch.currentStream.category}
                        </p>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <a
                          href={`https://twitch.tv/${creator.twitch.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Watch Now
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : creator.twitch.nextStream ? (
                <Card className="border-accent/30 bg-accent/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      Next Twitch Stream
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold mb-1">
                          {creator.twitch.nextStream.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            creator.twitch.nextStream.scheduledAt
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={`https://twitch.tv/${creator.twitch.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Follow on Twitch
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="shows" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="shows">Shows</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger className="hidden" value="membership">
              Membership
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shows">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {shows.map((show) => (
                <Link
                  key={show.title}
                  href={`/show/${show.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <PodcastCard {...show} />
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-display mb-4">
                About {creator.name}
              </h2>
              <div className="space-y-4 text-foreground/80">
                <p>{creator.bio}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="membership">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Membership Benefits */}
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-display">Premium Membership</h2>
                </div>

                <div className="text-4xl font-display mb-2">
                  $5
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">Cancel anytime</p>

                <ul className="space-y-4 mb-8">
                  {membershipBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {!isMember ? (
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    size="lg"
                    onClick={handleMembership}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Become a Member
                  </Button>
                ) : (
                  <div className="bg-accent/10 border border-accent/50 rounded-lg p-4 text-center">
                    <p className="text-accent font-semibold">
                      You're a Premium Member!
                    </p>
                  </div>
                )}
              </div>

              {/* Premium Content Preview */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display mb-4">
                    Premium Content
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Exclusive content only available to premium members
                  </p>
                </div>

                <div className="space-y-4">
                  {premiumContent.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-card border border-border rounded-lg p-6 relative overflow-hidden"
                    >
                      {!isMember && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <div className="text-center">
                            <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Premium Members Only
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{item.title}</h4>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {"duration" in item ? item.duration : item.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </MainLayout>
  );
}

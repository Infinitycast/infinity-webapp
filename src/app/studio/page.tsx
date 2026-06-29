import { StudioLayout } from "@/components/layouts/StudioLayout";
import { PodcastCard } from "@/components/studio/PodcastCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { Eye, Play, Plus, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { getMyShows } from "../actions/getMyShows";
import { redirect } from "next/navigation";
import { isUserCreator } from "../actions/isUserCreator";

export default async function Studio() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const isCreator = await isUserCreator({ userId: user?.id });

  if (isCreator === false) {
    redirect("/studio/onboarding");
  }

  const myShows = await getMyShows();

  const subscriptions: any[] = [];

  const stats = [
    {
      label: "Total Listeners",
      value: "--",
      change: "0%",
      icon: Users,
      color: "text-accent",
    },
    {
      label: "Total Plays",
      value: "--",
      change: "0%",
      icon: Play,
      color: "text-primary",
    },
    {
      label: "Total Views",
      value: "--",
      change: "0%",
      icon: Eye,
      color: "text-secondary",
    },
    {
      label: "Engagement Rate",
      value: "--",
      change: "0%",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  const recentActivity: any[] = [];

  return (
    <StudioLayout user={user}>
      <div className="p-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-display mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.first_name}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                  <span className="text-xs md:text-sm text-accent font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-accent/10">
                    {stat.change}
                  </span>
                </div>
                <div className="text-xl md:text-3xl font-display mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Shows */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-display mb-1">My Shows</h2>
                  <p className="text-sm text-muted-foreground">
                    Your podcast collection
                  </p>
                </div>
                <Link href="/create-show">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled
                  >
                    View all
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {myShows.map((show: any) => (
                  <Link
                    key={show.name}
                    href={`/show/${show.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <PodcastCard {...show} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-display mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{activity.episode}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.show}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {activity.plays} plays
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>No recent acivity</>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-display mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/studio/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Show
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <Play className="h-4 w-4 mr-2" />
                  Upload Episode
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Subscriptions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-display mb-4">My Subscriptions</h3>
              <div className="space-y-3">
                {subscriptions && subscriptions.length > 0 ? (
                  subscriptions.slice(0, 4).map((show) => (
                    <Link
                      key={show.title}
                      href={`/show/${show.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={show.image}
                        alt={show.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {show.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {show.host}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <>No subscriptions</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}

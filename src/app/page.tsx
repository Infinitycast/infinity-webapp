import { MainLayout } from "@/components/layouts/MainLayout";
import { Footer } from "@/components/layouts/Footer";

import { getCurrentUser } from "@/lib/auth";
import EpisodeCard from "@/components/elements/EpisodeCard";
import ScrollableSection from "@/components/elements/ScrollableSection";
import { Sparkles, TrendingUp } from "lucide-react";
import { getLatestEpisodes } from "./actions/getLatestEpisodes";

export default async function Home() {
  const user = await getCurrentUser();

  const latestEpisodes = await getLatestEpisodes();

  return (
    <div>
      <MainLayout user={user}>
        <div className="bg-background">
          {user ? (
            <section className="bg-muted/20">
              <div
                className="bg-green-900 border-l-4 border-green-700 text-green-300 p-4"
                role="alert"
              >
                <p className="font-bold">You're logged in!</p>
                <p>You're now signed in as {user.first_name}!</p>
              </div>
            </section>
          ) : (
            <section className="">
              <div
                className="bg-orange-900 border-l-4 border-orange-700 text-orange-300 p-4"
                role="alert"
              >
                <p className="font-bold">Be Warned</p>
                <p>
                  This site is currently in alpha. Things will change and may
                  break.
                </p>
              </div>
            </section>
          )}

          {/* Trending Episodes */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <ScrollableSection
                title={"Latest Episodes".toUpperCase()}
                description="The hottest episodes everyone's talking about"
                icon={<Sparkles className="h-6 w-6 text-accent" />}
                viewAllButton
              >
                {latestEpisodes &&
                  latestEpisodes.map((episode: any, i: number) => (
                    <div key={episode.title + i} className="flex-shrink-0 w-96">
                      <EpisodeCard {...episode} />
                    </div>
                  ))}
              </ScrollableSection>
            </div>
          </section>

          <Footer />
        </div>
      </MainLayout>
    </div>
  );
}

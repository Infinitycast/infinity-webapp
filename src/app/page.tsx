import { MainLayout } from "@/components/layouts/MainLayout";
import { Footer } from "@/components/layouts/Footer";

import { getCurrentUser } from "@/lib/auth";
import { EpisodeCard } from "@/components/elements/EpisodeCard";
import { ScrollableSection } from "@/components/elements/ScrollableSection";
import { TrendingUp } from "lucide-react";
import { getAllEpisodes } from "./actions/getAllEpisodes";

export default async function Home() {
  const user = await getCurrentUser();

  const trendingEpisodes = await getAllEpisodes();

  return (
    <div>
      <MainLayout user={user}>
        <div className="bg-background">
          {user ? (
            <section className="py-16 bg-muted/20">
              <div className="container mx-auto px-4">
                You're now signed in as {user.first_name}!
              </div>
            </section>
          ) : (
            <section className="py-16">
              <div className="container mx-auto px-4">
                Welcome to InfinityCast (alpha)
              </div>
            </section>
          )}

          {/* Trending Episodes */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <ScrollableSection
                title={"Trending Episodes".toUpperCase()}
                description="The hottest episodes everyone's talking about"
                icon={<TrendingUp className="h-6 w-6 text-accent" />}
                viewAllButton
              >
                {trendingEpisodes.map((episode, i) => (
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

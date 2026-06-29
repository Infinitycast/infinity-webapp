"use server";

import { getAsset } from "@/lib/assets";
import { BACKEND_URL } from "@/lib/globals";

export async function getLatestEpisodes() {
  try {
    const res = await fetch(
      `${BACKEND_URL}/items/episodes?limit=14&sort=-date_created`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Failed to fetch episode");

    const { data: episodes } = await res.json();

    const showIds = [...new Set(episodes.map((e: any) => e.show))];

    const showsRes = await fetch(
      `${BACKEND_URL}/items/shows?filter[id][_in]=${showIds.join(
        ","
      )}&fields=id,name,slug`,
      {
        cache: "no-store",
      }
    );

    if (!showsRes.ok) throw new Error("Failed to fetch shows");

    const { data: shows } = await showsRes.json();

    const showMap = Object.fromEntries(
      shows.map((show: any) => [show.id, show])
    );

    return episodes.map((episode: any) => ({
      ...episode,
      show: showMap[episode.show] ?? null,
      image: getAsset(episode.thumbnail),
    }));
  } catch (error) {
    console.error("Fetching episodes error:", error);
    return null;
  }
}

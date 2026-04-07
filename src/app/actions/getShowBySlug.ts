"use server";

import { getAsset } from "@/lib/assets";
import { BACKEND_URL } from "@/lib/globals";

export async function getShowBySlug(slug: string) {
  // Fetch show
  const showRes = await fetch(
    `${BACKEND_URL}/items/shows?filter[slug][_eq]=${slug}&limit=1`,
    { cache: "no-store" }
  );

  if (!showRes.ok) throw new Error("Failed to fetch show");

  const { data: showData } = await showRes.json();
  if (!showData?.length) throw new Error("Show not found");

  const show = showData[0];

  // Fetch hosts
  const junctionRes = await fetch(
    `${BACKEND_URL}/items/shows_creator?filter[shows_id][_eq]=${show.id}`,
    { cache: "no-store" }
  );

  if (!junctionRes.ok) throw new Error("Failed to fetch show creators");

  const { data: junctionData } = await junctionRes.json();
  const creatorIds = junctionData.map((j: any) => j.creator_id);

  let hosts: any[] = [];

  if (creatorIds.length) {
    const creatorsRes = await fetch(
      `${BACKEND_URL}/items/creator?filter[id][_in]=${creatorIds.join(
        ","
      )}&fields=id,name`,
      { cache: "no-store" }
    );

    if (!creatorsRes.ok) throw new Error("Failed to fetch creators");

    const { data: creatorsData } = await creatorsRes.json();

    hosts = creatorsData.map((c: any) => ({
      id: c.id,
      name: c.name,
    }));
  }

  // Fetch series
  const seriesRes = await fetch(
    `${BACKEND_URL}/items/series?filter[show][_eq]=${show.id}&sort=order`,
    { cache: "no-store" }
  );

  if (!seriesRes.ok) throw new Error("Failed to fetch series");

  const { data: seriesData } = await seriesRes.json();

  // Fetch episodes
  const seriesIds = seriesData.map((s: any) => s.id);

  let episodesData: any[] = [];

  if (seriesIds.length) {
    const episodesRes = await fetch(
      `${BACKEND_URL}/items/episodes?filter[series][_in]=${seriesIds.join(
        ","
      )}&filter[status][_eq]=published&sort=-release_date`,
      { cache: "no-store" }
    );

    if (!episodesRes.ok) throw new Error("Failed to fetch episodes");

    const { data } = await episodesRes.json();
    episodesData = data;
  }

  // Build series WITH transformed images (single pass)
  const seriesWithEpisodes = seriesData.map((series: any) => {
    const episodes = episodesData
      .filter((ep) => ep.series === series.id)
      .map((ep) => ({
        id: ep.id,
        title: ep.title,
        episode_number: ep.episode_number,
        image: getAsset(ep.image),
        duration: ep.duration ?? "—",
        date: new Date(ep.release_date).toLocaleDateString(),
        description: ep.about,
      }));

    return {
      id: series.id,
      title: series.series_title,
      episodes,
    };
  });

  // Single clean return
  return {
    ...show,
    image: getAsset(show.image),
    display_picture: getAsset(show.display_picture),
    hosts,
    series: seriesWithEpisodes,
  };
}

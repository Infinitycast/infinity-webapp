"use server";

import { getAsset } from "@/lib/assets";
import { BACKEND_URL } from "@/lib/globals";

export async function getEpisodeById(episodeId: string) {
  try {
    // 1. Fetch episode
    const res = await fetch(`${BACKEND_URL}/items/episodes/${episodeId}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch episode");

    const { data } = await res.json();

    // 2. Fetch show
    const showRes = await fetch(
      `${BACKEND_URL}/items/shows/${data.show}?fields=id,name,slug`,
      { cache: "no-store" }
    );

    if (!showRes.ok) throw new Error("Failed to fetch show");

    const { data: show } = await showRes.json();

    // 3. Fetch junction (shows_creator)
    const junctionRes = await fetch(
      `${BACKEND_URL}/items/shows_creator?filter[shows_id][_eq]=${data.show}`,
      { cache: "no-store" }
    );

    if (!junctionRes.ok) throw new Error("Failed to fetch junction");

    const { data: junctionData } = await junctionRes.json();

    const creatorIds = junctionData.map((j: any) => j.creator_id);

    // 4. Fetch creators
    let creators: any[] = [];

    if (creatorIds.length) {
      const creatorsRes = await fetch(
        `${BACKEND_URL}/items/creator?filter[id][_in]=${creatorIds.join(
          ","
        )}&fields=id,name`,
        { cache: "no-store" }
      );

      if (creatorsRes.ok) {
        const { data: creatorsData } = await creatorsRes.json();

        creators = creatorsData.map((c: any) => ({
          id: c.id,
          name: c.name,
        }));
      }
    }

    // 5. Return clean object
    return {
      id: data.id,
      title: data.title,
      description: data.about,
      date: new Date(data.release_date).toLocaleDateString(),
      video: getAsset(data.video),
      image: getAsset(data.image),
      show: show
        ? {
            id: show.id,
            name: show.name,
            slug: show.slug,
          }
        : null,
      creators,
    };
  } catch (error) {
    console.error("getEpisodeById error:", error);
    return null;
  }
}

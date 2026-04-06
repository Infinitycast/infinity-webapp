"use server";

import { cookies } from "next/headers";
import { Global } from "@/lib/directus";
import { getAsset } from "@/lib/assets";

export async function getMyShows() {
  const cookieStore = await cookies();
  const token = cookieStore.get(Global.COOKIE)?.value;

  if (!token) {
    throw new Error("No token");
  }

  try {
    const meRes = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!meRes.ok) {
      throw new Error("Session invalid");
    }

    const me = await meRes.json();
    const userId = me.data.id;

    const creatorsRes = await fetch(
      `${process.env.BACKEND_URL}/items/creator?filter[owner][_eq]=${userId}&fields=id,owner&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!creatorsRes.ok) {
      throw new Error("Failed to fetch creator");
    }

    const creatorsData = await creatorsRes.json();

    const myCreatorIds = creatorsData.data.map((c: any) => c.id);

    if (myCreatorIds.length === 0) return [];

    const junctionRes = await fetch(
      `${process.env.BACKEND_URL}/items/shows_creator`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!junctionRes.ok) throw new Error("Junction fetch failed");

    const junctionData = await junctionRes.json();

    const myShowIds: number[] = [];

    for (const row of junctionData.data) {
      if (myCreatorIds.includes(row.creator_id)) {
        myShowIds.push(row.shows_id);
      }
    }

    if (myShowIds.length === 0) return [];

    const showsRes = await fetch(`${process.env.BACKEND_URL}/items/shows`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!showsRes.ok) throw new Error("Shows fetch failed");

    const showsData = await showsRes.json();

    const userShows = showsData.data.filter((show: any) =>
      myShowIds.includes(show.id)
    );

    const transformedShows = userShows.map((show: any) => ({
      ...show,
      image: getAsset(show.image),
      display_picture: getAsset(show.display_picture),
    }));

    return transformedShows;
  } catch (error) {
    console.error("Error fetching my shows:", error);
    return [];
  }
}

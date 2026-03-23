"use server";

import { cookies } from "next/headers";
import { Global } from "@/lib/directus";

export async function getShowBySlug(slug: string) {
  const cookie = await cookies();
  const token = cookie.get(Global.COOKIE)?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch show
  const showRes = await fetch(
    `${process.env.BACKEND_URL}/items/shows?filter[slug][_eq]=${slug}&limit=1`,
    { headers, cache: "no-store" }
  );

  if (!showRes.ok) throw new Error("Failed to fetch show");

  const { data: showData } = await showRes.json();

  if (!showData || showData.length === 0) {
    throw new Error("Show not found");
  }

  const show = showData[0];

  // Fetch junction (shows_creator)
  const junctionRes = await fetch(
    `${process.env.BACKEND_URL}/items/shows_creator?filter[shows_id][_eq]=${show.id}`,
    { headers, cache: "no-store" }
  );

  if (!junctionRes.ok) throw new Error("Failed to fetch show creators");

  const { data: junctionData } = await junctionRes.json();

  // Extract creator IDs
  const creatorIds = junctionData.map((item: any) => item.creator_id);

  if (creatorIds.length === 0) {
    return {
      ...show,
      hosts: [],
    };
  }

  // Fetch creators by IDs
  const creatorsRes = await fetch(
    `${process.env.BACKEND_URL}/items/creator?filter[id][_in]=${creatorIds.join(
      ","
    )}&fields=id,name`,
    { headers, cache: "no-store" }
  );

  if (!creatorsRes.ok) throw new Error("Failed to fetch creators");

  const { data: creatorsData } = await creatorsRes.json();

  // Map into hosts array
  const hosts = creatorsData.map((creator: any) => ({
    id: creator.id,
    name: creator.name,
  }));

  return {
    ...show,
    hosts,
  };
}

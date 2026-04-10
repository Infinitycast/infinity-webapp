"use server";

import { getAsset } from "@/lib/assets";
import { BACKEND_URL } from "@/lib/globals";

export async function getAllEpisodes() {
  try {
    const res = await fetch(`${BACKEND_URL}/items/episodes`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch episode");

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Fetching episodes error:", error);
    return null;
  }
}

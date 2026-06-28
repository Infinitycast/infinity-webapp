"use server";

import { getAsset } from "@/lib/assets";
import { BACKEND_URL } from "@/lib/globals";

export async function getCreatorByUsername(username: string) {
  try {
    // Get creator
    const creatorRes = await fetch(
      `${BACKEND_URL}/items/creator?filter[username][_eq]=${encodeURIComponent(
        username
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!creatorRes.ok) throw new Error("Failed to fetch creator");

    const { data } = await creatorRes.json();

    const creator = data[0];

    if (!creator) return null;

    // Get followers
    const followersRes = await fetch(
      `${BACKEND_URL}/items/followers?filter[creator][_eq]=${creator.id}`,
      {
        cache: "no-store",
      }
    );

    if (!followersRes.ok) throw new Error("Failed to fetch followers");

    const { data: followers } = await followersRes.json();

    return {
      id: creator.id,
      name: creator.name,
      username: creator.username,
      role: creator.role,
      bio: creator.bio,
      display_picture: getAsset(creator.display_picture),
      followers: followers.length,
    };
  } catch (error) {
    console.error("getCreatorByUsername error:", error);
    return null;
  }
}

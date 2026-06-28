"use server";

import { BACKEND_URL } from "@/lib/globals";

export async function checkFollowers(
  me: string,
  creatorId: string
): Promise<{ following: boolean; followId: string | undefined }> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/items/followers?filter[follower][_eq]=${me}&filter[creator][_eq]=${creatorId}&limit=1`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to check validity of following");
    }

    const { data } = await res.json();

    return {
      following: Boolean(data.length > 0),
      followId: data[0]?.id ?? undefined,
    };
  } catch (error) {
    console.error("checkSubscription error:", error);
    return {
      following: false,
      followId: undefined,
    };
  }
}

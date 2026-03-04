"use server";

import { cookies } from "next/headers";
import { Global } from "@/lib/directus";

export async function isUserCreator({
  userId,
}: {
  userId: string;
}): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(Global.COOKIE)?.value;

  if (!token) {
    return false;
  }

  try {
    const creatorsRes = await fetch(
      `${process.env.BACKEND_URL}/items/creator?filter[owner][_eq]=${String(
        userId
      )}&fields=id,owner&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const creatorsData = await creatorsRes.json();
    console.log("creator data:", creatorsData);
    return creatorsData.data?.length > 0;
  } catch (error) {
    console.error("Error checking creator profile:", error);
    return false;
  }
}

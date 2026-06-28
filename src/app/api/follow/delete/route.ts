import { NextResponse } from "next/server";
import { client, Global } from "@/lib/directus";
import { deleteItems } from "@directus/sdk";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
  try {
    const { followerId } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get(Global.COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    client.setToken(token);

    await client.request(deleteItems("followers", [followerId]));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unfollow failed:", err);

    return NextResponse.json(
      { error: err.message ?? "Failed to unfollow" },
      { status: 500 }
    );
  }
}

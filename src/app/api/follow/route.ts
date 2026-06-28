import { NextResponse } from "next/server";
import { client, Global } from "@/lib/directus";
import { createItem, readMe } from "@directus/sdk";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { creatorId } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get(Global.COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await client.setToken(token);

    const me = await client.request(readMe());

    await client.request(
      createItem("followers", {
        follower: me.id,
        creator: creatorId,
      })
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: err.message ?? "Failed to follow creator" },
      { status: 500 }
    );
  }
}

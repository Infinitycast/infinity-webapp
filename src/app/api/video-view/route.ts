import { BACKEND_URL } from "@/lib/globals";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Validate request
  if (!body.videoId || body.episodeId) {
    return NextResponse.json({ error: "Missing identifiers" }, { status: 400 });
  }

  // TODO:
  // Check qualification
  // Check duplicates
  // Rate limit

  // Call Directus

  const res = await fetch(`${BACKEND_URL}/items/video-views`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VIEW_BOT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video: body.videoId,
      session: body.sessionId,
      qualified: true,
    }),
  });

  if (!res) {
    return NextResponse.json({ error: "update failed" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

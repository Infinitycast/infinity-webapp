import { NextResponse } from "next/server";
import { client, Global } from "@/lib/directus";
import { logout } from "@directus/sdk";

export async function POST() {
  const res = NextResponse.json({ success: true });

  try {
    await client.request(logout());
  } catch {
    // ignore — token may already be invalid
  }

  // Clear access and refresh tokens
  res.cookies.delete(Global.COOKIE);
  res.cookies.delete(Global.REFRESH_COOKIE);

  return res;
}

import { NextResponse } from "next/server";
import { client, Global } from "@/lib/directus";
import { AuthenticationMode, refresh } from "@directus/sdk";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(Global.REFRESH_COOKIE)?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const result = await client.request(
      refresh(
        refreshToken as AuthenticationMode | undefined,
        { mode: "cookie" } as any
      )
    );

    const res = NextResponse.json({ success: true });

    res.cookies.set(Global.COOKIE, result.access_token!, {
      httpOnly: true,
      path: "/",
      maxAge: result.expires ?? 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.cookies.set(Global.REFRESH_COOKIE, result.refresh_token!, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("Refresh failed:", err);
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}

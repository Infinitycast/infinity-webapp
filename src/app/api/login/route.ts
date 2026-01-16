import { NextResponse } from "next/server";
import { client, Global } from "@/lib/directus";
import { login } from "@directus/sdk";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const result = await client.request(
      login(String(email), String(password), { mode: "json" })
    );

    const accessToken = result.access_token!;
    const expires = result.expires ?? 60 * 60 * 24;

    const res = NextResponse.json({ success: true });

    res.cookies.set(Global.COOKIE, String(accessToken), {
      httpOnly: true,
      path: "/",
      maxAge: Number(expires),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.cookies.set(Global.REFRESH_COOKIE, String(result.refresh_token), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (err: any) {
    console.error("Login failed:", err);
    return NextResponse.json(
      { error: err?.message || "Login failed" },
      { status: 401 }
    );
  }
}

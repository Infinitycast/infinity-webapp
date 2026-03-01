import { NextResponse } from "next/server";
import { client, Global } from "@/lib/directus";
import { AuthenticationMode, refresh } from "@directus/sdk";

// Shared helper function like checkLoginToken
export async function checkLoginToken(
  accessToken?: string,
  refreshToken?: AuthenticationMode | undefined
) {
  // No access token → immediately try refresh
  if (!accessToken) {
    if (!refreshToken) return { allow: false };

    try {
      const result = await client.request(
        refresh(refreshToken, { mode: "json" } as any)
      );

      // Return refreshed tokens and mark allow true
      return {
        allow: true,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      };
    } catch (err) {
      console.error("Refresh failed:", err);
      return { allow: false };
    }
  }

  // Access token exists → optionally refresh if needed
  if (refreshToken) {
    try {
      const result = await client.request(
        refresh(refreshToken, { mode: "json" } as any)
      );

      return {
        allow: true,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      };
    } catch (err) {
      console.error("Refresh failed:", err);
      return { allow: true, accessToken, refreshToken }; // token exists but refresh failed, still allow
    }
  }

  // Access token exists, no refresh token → allow but no refresh
  return { allow: true, accessToken };
}

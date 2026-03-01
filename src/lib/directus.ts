import { authentication, createDirectus, rest } from "@directus/sdk";

export enum Global {
  COOKIE = "directus_session_token",
  REFRESH_COOKIE = "directus_refresh_token",
}

export interface Schema {
  directus_files: unknown;
}

export const client = createDirectus(String(process.env.BACKEND_URL))
  .with(rest())
  .with(authentication("json"));

import { BACKEND_URL } from "./globals";

export const getAsset = (assetId: string) => {
  if (!assetId) return null;
  return `${BACKEND_URL}/assets/${assetId}`;
};

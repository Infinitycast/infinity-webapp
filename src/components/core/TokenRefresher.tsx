"use client";

import { useEffect } from "react";

const REFRESH_INTERVAL = 120 * 60 * 1000;

export function TokenRefresher() {
  useEffect(() => {
    const refresh = async () => {
      await fetch("/api/refresh", { method: "POST" });
    };

    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return null;
}

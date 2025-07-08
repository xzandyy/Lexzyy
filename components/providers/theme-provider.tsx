"use client";

import { useEffect } from "react";
import { initializeTheme } from "@/stores/theme-store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cleanup = initializeTheme();
    return cleanup;
  }, []);

  return <>{children}</>;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  getSystemTheme: () => ResolvedTheme;
  initializeTheme: () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: ResolvedTheme) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  if (mode === "system") {
    return getSystemTheme();
  }
  return mode;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      resolvedTheme: "light",

      setMode: (mode: ThemeMode) => {
        const resolvedTheme = resolveTheme(mode);

        set({
          mode,
          resolvedTheme,
        });

        applyTheme(resolvedTheme);
      },

      getSystemTheme,

      initializeTheme: () => {
        const state = get();
        const resolvedTheme = resolveTheme(state.mode);

        set({
          resolvedTheme,
        });

        applyTheme(resolvedTheme);
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);

export function initializeTheme(): (() => void) | undefined {
  const store = useThemeStore.getState();
  store.initializeTheme();

  if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const currentState = useThemeStore.getState();
      if (currentState.mode === "system") {
        const newResolvedTheme = e.matches ? "dark" : "light";
        useThemeStore.setState({
          resolvedTheme: newResolvedTheme,
        });
        applyTheme(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }
}

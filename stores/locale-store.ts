import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultLocale, detectBrowserLanguage, getSupportedLocales } from "@/locales";
import { loadLocale } from "@/locales";
import type { Locale, Dictionary } from "@/locales";

interface LocaleState {
  locale: Locale;
  dictionary: Dictionary | null;
  setLocale: (locale: Locale) => Promise<void>;
  getInitialLocale: () => Locale;
  reset: () => Promise<void>;
}

let currentRequestId = 0;

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      dictionary: null,

      setLocale: async (locale: Locale) => {
        const requestId = ++currentRequestId;

        try {
          const dictionary = await loadLocale(locale);

          if (requestId === currentRequestId) {
            set({
              locale,
              dictionary,
            });
          }
        } catch (error) {
          console.error("Error setting locale:", error);
        }
      },

      getInitialLocale: () => {
        const stored = localStorage.getItem("locale-storage");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const storedLocale = parsed?.state?.locale;
            if (storedLocale && getSupportedLocales().includes(storedLocale)) {
              return storedLocale as Locale;
            }
          } catch (e) {
            console.warn("Failed to parse stored locale:", e);
          }
        }

        return detectBrowserLanguage();
      },

      reset: async () => {
        const detectedLocale = detectBrowserLanguage();
        const requestId = ++currentRequestId;

        try {
          const dictionary = await loadLocale(detectedLocale);

          if (requestId === currentRequestId) {
            set({
              locale: detectedLocale,
              dictionary,
            });
          }
        } catch (error) {
          console.error("Error resetting locale:", error);
        }
      },
    }),
    {
      name: "locale-storage",
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
);

export async function initializeLocale(): Promise<void> {
  const store = useLocaleStore.getState();
  const initialLocale = store.getInitialLocale();

  if (initialLocale !== store.locale || !store.dictionary) {
    await store.setLocale(initialLocale);
  }
}

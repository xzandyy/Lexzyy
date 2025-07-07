import { useEffect, useMemo } from "react";
import { useLocaleStore, initializeLocale } from "@/stores/locale-store";
import type { Dictionary } from "@/locales";

export function useLocale() {
  const { locale, dictionary, setLocale, reset } = useLocaleStore();

  useEffect(() => {
    initializeLocale().catch(console.error);
  }, []);

  const t = useMemo(() => {
    return dictionary || ({} as Dictionary);
  }, [dictionary]);

  return {
    locale,
    t,
    setLocale,
    reset,
  };
}

import { useEffect, useMemo } from "react";
import { useLocaleStore, initializeLocale } from "@/stores/locale-store";
import { emptyDictionary } from "@/locales";

export function useLocale() {
  const { locale, dictionary, setLocale, reset } = useLocaleStore();

  useEffect(() => {
    initializeLocale().catch(console.error);
  }, []);

  const t = useMemo(() => {
    return dictionary || emptyDictionary;
  }, [dictionary]);

  return {
    locale,
    t,
    setLocale,
    reset,
  };
}

import { useEffect, useMemo } from "react";
import { useLocaleStore, initializeLocale } from "@/stores/locale-store";
import zhCNDictionary from "@/locales/dictionaries/zh-CN";

export function useLocale() {
  const { locale, dictionary, setLocale, reset } = useLocaleStore();

  useEffect(() => {
    initializeLocale().catch(console.error);
  }, []);

  const t = useMemo(() => {
    return dictionary || zhCNDictionary;
  }, [dictionary]);

  return {
    locale,
    t,
    setLocale,
    reset,
  };
}

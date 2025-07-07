import React from "react";
import { PanelHeader } from "@/components/common";
import { useLocale } from "@/hooks/use-locale";
import { localeNames, getSupportedLocales } from "@/locales";
import type { Locale } from "@/locales";

export default function Settings() {
  const { locale, t, setLocale } = useLocale();

  const handleLanguageChange = async (newLocale: Locale) => {
    try {
      await setLocale(newLocale);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const supportedLocales = getSupportedLocales();

  return (
    <div className="h-full flex flex-col">
      <PanelHeader label={t.settings.title} />
      <div className="p-4 flex-1">
        <div className="space-y-6">
          {/* 语言设置 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.settings.language}</h3>
            <div className="space-y-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400">
                {t.settings.currentLanguage}: {localeNames[locale] || locale}
              </label>
              <select
                value={locale}
                onChange={(e) => handleLanguageChange(e.target.value as Locale)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {supportedLocales.map((localeCode) => (
                  <option key={localeCode} value={localeCode}>
                    {localeNames[localeCode]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

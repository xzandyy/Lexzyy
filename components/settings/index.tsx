import React from "react";
import { PanelHeader } from "@/components/common";
import { useLocale } from "@/hooks/use-locale";
import { localeNames, getSupportedLocales } from "@/locales";
import type { Locale } from "@/locales";
import { useThemeStore } from "@/stores/theme-store";
import type { ThemeMode } from "@/stores/theme-store";
import { Sun, Moon, Monitor } from "lucide-react";

export default function Settings() {
  const { locale, t, setLocale } = useLocale();
  const { mode, resolvedTheme, setMode } = useThemeStore();

  const handleLanguageChange = async (newLocale: Locale) => {
    try {
      await setLocale(newLocale);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const supportedLocales = getSupportedLocales();

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: t.settings.lightTheme, icon: <Sun size={16} /> },
    { value: "dark", label: t.settings.darkTheme, icon: <Moon size={16} /> },
    { value: "system", label: t.settings.systemTheme, icon: <Monitor size={16} /> },
  ];

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

          {/* 主题设置 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.settings.theme}</h3>
              <div className="space-y-2">
                <label className="block text-xs text-gray-500 dark:text-gray-400">
                  {t.settings.currentTheme}: {resolvedTheme} {mode === "system" && `(${t.settings.systemTheme})`}
                </label>
                <div className="flex gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMode(option.value)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm
                        ${
                          mode === option.value
                            ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

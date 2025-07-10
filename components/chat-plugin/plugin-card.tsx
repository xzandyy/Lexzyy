"use client";

import useLocale from "@/hooks/use-locale";
import { PluginBase } from "@/lib/plugin-manager/types";
import { pluginUIManager } from "@/lib/plugin-manager";
import { Switch } from "@/components/ui/switch";
import { Suspense } from "react";

interface PluginCardProps {
  plugin: PluginBase<any>;
  isEnabled: boolean;
  onToggle: (toolName: string) => void;
  onCardClick: (toolName: string) => void;
}

export const PluginCard = ({ plugin, isEnabled, onToggle, onCardClick }: PluginCardProps) => {
  const { t } = useLocale();

  const handleCardClick = () => {
    onCardClick(plugin.meta.toolName);
  };

  const handleSwitchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(plugin.meta.toolName);
  };

  // 获取插件图标UI
  const IconUI = pluginUIManager.getIconUI(plugin.meta.toolName);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            {IconUI ? (
              <Suspense fallback={<div className="w-6 h-6 bg-blue-500 rounded animate-pulse"></div>}>
                <IconUI size={24} className="text-blue-600 dark:text-blue-400" />
              </Suspense>
            ) : (
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{plugin.meta.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{plugin.meta.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isEnabled ? t.plugins.enabled : t.plugins.disabled}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{plugin.meta.toolName}</div>
          </div>

          <div onClick={handleSwitchClick}>
            <Switch checked={isEnabled} onCheckedChange={() => onToggle(plugin.meta.toolName)} />
          </div>
        </div>
      </div>
    </div>
  );
};

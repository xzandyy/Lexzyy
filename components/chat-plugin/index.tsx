"use client";

import { useEffect, useState } from "react";
import { pluginUIManager } from "@/lib/plugin-manager";
import { PluginBase } from "@/lib/plugin-manager/types";
import { PanelHeader } from "@/components/common";
import useLocale from "@/hooks/use-locale";
import { PluginCard } from "./plugin-card";

interface ChatPluginProps {
  enabledPlugins: string[];
  onEnabledPluginsChange: (enabledPlugins: string[]) => void;
  onPluginClick: (currentClickPlugin: string) => void;
}

export default function ChatPlugin({ enabledPlugins, onEnabledPluginsChange, onPluginClick }: ChatPluginProps) {
  const { t } = useLocale();
  const [pluginMetas, setPluginMetas] = useState<PluginBase<any>[]>([]);

  useEffect(() => {
    setPluginMetas(pluginUIManager.getAllPluginMetas());
  }, []);

  const handleTogglePlugin = (toolName: string) => {
    if (enabledPlugins.includes(toolName)) {
      onEnabledPluginsChange(enabledPlugins.filter((p) => p !== toolName));
    } else {
      onEnabledPluginsChange([...enabledPlugins, toolName]);
    }
  };

  const handleCardClick = (toolName: string) => {
    onPluginClick(toolName);
  };

  return (
    <div className="h-full flex flex-col">
      <PanelHeader label={t.plugins.title}>
        <div className="text-xs text-gray-500">
          {enabledPlugins.length > 0
            ? t.plugins.enabledCount.replace("{count}", enabledPlugins.length.toString())
            : t.plugins.noEnabledPlugins}
        </div>
      </PanelHeader>

      <div className="flex-1 overflow-y-auto p-4">
        {pluginMetas.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-lg mb-2">{t.plugins.noPlugins}</div>
            <div className="text-sm">{t.plugins.installPlugins}</div>
          </div>
        ) : (
          <div className="space-y-3">
            {pluginMetas.map((plugin) => (
              <PluginCard
                key={plugin.meta.toolName}
                plugin={plugin}
                isEnabled={enabledPlugins.includes(plugin.meta.toolName)}
                onToggle={handleTogglePlugin}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { pluginUIManager } from "@/lib/plugin-manager";
import { PluginBase } from "@/lib/plugin-manager/types";

export default function usePlugin() {
  const [pluginMetas, setPluginMetas] = useState<PluginBase<any>[]>([]);
  const [pluginConfigs, setPluginConfigs] = useState<Map<string, Record<string, any>>>(new Map());
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>([]);
  const [openPlugin, setOpenPlugin] = useState<string>("");

  useEffect(() => {
    setPluginConfigs(pluginUIManager.getAllPluginConfigs());
    setPluginMetas(pluginUIManager.getAllPluginMetas());
  }, []);

  const openPluginConfig = useMemo(() => {
    if (!openPlugin) return null;

    const config = pluginConfigs.get(openPlugin);
    if (!config) return null;

    const meta = pluginMetas.find((m) => m.meta.toolName === openPlugin);
    if (!meta) return null;

    return {
      toolName: openPlugin,
      meta: meta.meta,
      config: config,
      configUI: pluginUIManager.getConfigUI(openPlugin),
    };
  }, [openPlugin, pluginConfigs, pluginMetas]);

  const updatePluginConfig = (toolName: string, config: Record<string, any>) => {
    setPluginConfigs((prev) => {
      const newConfigs = new Map(prev);
      newConfigs.set(toolName, { ...prev.get(toolName), ...config });
      return newConfigs;
    });
  };

  const getEnabledPluginConfigs = (): Record<string, Record<string, any>> => {
    const enabledConfigs: Record<string, Record<string, any>> = {};
    enabledPlugins.forEach((toolName) => {
      const config = pluginConfigs.get(toolName);
      if (config) {
        enabledConfigs[toolName] = config;
      }
    });
    return enabledConfigs;
  };

  const handleEnabledPluginsChange = (newEnabledPlugins: string[]) => {
    setEnabledPlugins(newEnabledPlugins);
  };

  const handlePluginClick = (currentClickPlugin: string) => {
    if (openPlugin === currentClickPlugin) {
      setOpenPlugin("");
    } else {
      setOpenPlugin(currentClickPlugin);
    }
  };

  const handleConfigChange = (toolName: string, config: Record<string, any>) => {
    updatePluginConfig(toolName, config);
  };

  return {
    enabledPlugins,
    openPlugin,
    openPluginConfig,
    getEnabledPluginConfigs,
    handleEnabledPluginsChange,
    handlePluginClick,
    handleConfigChange,
  };
}

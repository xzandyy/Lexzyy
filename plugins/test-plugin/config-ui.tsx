"use client";

import React, { useState, useEffect } from "react";
import { PluginConfigUIProps } from "@/lib/plugin-manager/types";
import { TestPluginConfig } from "./types";

const ConfigUI: React.FC<PluginConfigUIProps<TestPluginConfig>> = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState<TestPluginConfig>({
    enabled: config.enabled ?? true,
    prefix: config.prefix ?? "计算结果: ",
  });

  useEffect(() => {
    setLocalConfig({
      enabled: config.enabled ?? true,
      prefix: config.prefix ?? "计算结果: ",
    });
  }, [config]);

  const handleChange = (updates: Partial<TestPluginConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={localConfig.enabled}
            onChange={(e) => handleChange({ enabled: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium">启用计算器</span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">结果前缀</label>
        <input
          type="text"
          value={localConfig.prefix}
          onChange={(e) => handleChange({ prefix: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="例如：计算结果: "
        />
      </div>

      <div className="pt-4 border-t">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <strong>说明:</strong> 计算器插件用于执行数学乘法运算。你可以自定义结果显示的前缀。
        </div>
      </div>
    </div>
  );
};

export default ConfigUI;

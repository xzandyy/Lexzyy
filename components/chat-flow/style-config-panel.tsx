import React, { useState } from "react";
import { X, RotateCcw, Settings } from "lucide-react";
import { StyleConfig } from "./types";
import { STYLE_CONFIG_OPTIONS, CONFIG_GROUPS, DEFAULT_STYLE_CONFIG } from "./config";

interface StyleConfigPanelProps {
  styleConfig: StyleConfig;
  onStyleConfigChange: (config: StyleConfig) => void;
}

export function StyleConfigPanel({ styleConfig, onStyleConfigChange }: StyleConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfigChange = (key: keyof StyleConfig, value: number) => {
    onStyleConfigChange({
      ...styleConfig,
      [key]: value,
    });
  };

  const resetToDefault = () => {
    onStyleConfigChange(DEFAULT_STYLE_CONFIG);
  };

  return (
    <>
      {/* 设置按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-gray-300 z-30"
        title="样式设置"
      >
        <Settings size={20} className="text-gray-600" />
      </button>

      {/* 样式配置面板 */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
          <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto">
              {/* 标题栏 */}
              <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
                <h3 className="text-sm font-semibold text-gray-900">样式配置</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={resetToDefault}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition-colors"
                    title="重置为默认值"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* 配置项 */}
              <div className="p-3 space-y-4">
                {Object.entries(CONFIG_GROUPS).map(([groupKey, group]) => (
                  <div key={groupKey}>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">{group.title}</h4>
                    <div className="space-y-2">
                      {group.options.map((optionKey) => {
                        const option = STYLE_CONFIG_OPTIONS[optionKey];
                        const value = styleConfig[optionKey];
                        const displayValue = option.step < 1 ? Number(value).toFixed(1) : value;

                        return (
                          <div key={optionKey}>
                            <label className="block text-xs text-gray-500 mb-1">
                              {option.label}: {displayValue}
                              {option.unit}
                            </label>
                            <input
                              type="range"
                              min={option.min}
                              max={option.max}
                              step={option.step}
                              value={value}
                              onChange={(e) => handleConfigChange(optionKey, Number(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

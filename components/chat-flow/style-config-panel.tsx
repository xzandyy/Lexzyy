import React, { memo, useCallback } from "react";
import { X, RotateCcw } from "lucide-react";
import useLocale from "@/hooks/use-locale";
import { DEFAULT_STYLE_CONFIG, StyleConfig, useStyleConfigOptions, useConfigGroups } from "./types";

const ConfigSlider = memo<{
  optionKey: keyof StyleConfig;
  option: { min: number; max: number; step: number; label: string; unit: string };
  value: number;
  onChange: (key: keyof StyleConfig, value: number) => void;
}>(({ optionKey, option, value, onChange }) => {
  const displayValue = option.step < 1 ? Number(value).toFixed(1) : value;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(optionKey, Number(e.target.value));
    },
    [optionKey, onChange],
  );

  return (
    <div>
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
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
});

ConfigSlider.displayName = "ConfigSlider";

const ConfigSelect = memo<{
  optionKey: keyof StyleConfig;
  option: { options: readonly { value: string; label: string }[]; label: string };
  value: string;
  onChange: (key: keyof StyleConfig, value: string) => void;
}>(({ optionKey, option, value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(optionKey, e.target.value);
    },
    [optionKey, onChange],
  );

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{option.label}</label>
      <select
        value={value}
        onChange={handleChange}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {option.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

ConfigSelect.displayName = "ConfigSelect";

const ConfigCheckbox = memo<{
  optionKey: keyof StyleConfig;
  option: { label: string };
  value: boolean;
  onChange: (key: keyof StyleConfig, value: boolean) => void;
}>(({ optionKey, option, value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(optionKey, e.target.checked);
    },
    [optionKey, onChange],
  );

  return (
    <div>
      <label className="flex items-center text-xs text-gray-500">
        <input
          type="checkbox"
          checked={value}
          onChange={handleChange}
          className="mr-2 w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        {option.label}
      </label>
    </div>
  );
});

ConfigCheckbox.displayName = "ConfigCheckbox";

const ConfigOption = memo<{
  optionKey: keyof StyleConfig;
  styleConfig: StyleConfig;
  onChange: (key: keyof StyleConfig, value: number | string | boolean) => void;
}>(({ optionKey, styleConfig, onChange }) => {
  const styleConfigOptions = useStyleConfigOptions();
  const option = styleConfigOptions[optionKey];
  const value = styleConfig[optionKey];

  if ("min" in option && "max" in option) {
    return <ConfigSlider optionKey={optionKey} option={option} value={value as number} onChange={onChange} />;
  }

  if ("options" in option) {
    return <ConfigSelect optionKey={optionKey} option={option} value={value as string} onChange={onChange} />;
  }

  if (typeof option.default === "boolean") {
    return <ConfigCheckbox optionKey={optionKey} option={option} value={value as boolean} onChange={onChange} />;
  }

  return null;
});

ConfigOption.displayName = "ConfigOption";

const ConfigGroup = memo<{
  groupKey: string;
  group: { title: string; options: readonly (keyof StyleConfig)[] };
  styleConfig: StyleConfig;
  onChange: (key: keyof StyleConfig, value: number | string | boolean) => void;
}>(({ groupKey, group, styleConfig, onChange }) => {
  return (
    <div key={groupKey}>
      <h4 className="text-xs font-medium text-gray-700 mb-2">{group.title}</h4>
      <div className="space-y-2">
        {group.options.map((optionKey) => (
          <ConfigOption key={optionKey} optionKey={optionKey} styleConfig={styleConfig} onChange={onChange} />
        ))}
      </div>
    </div>
  );
});

ConfigGroup.displayName = "ConfigGroup";

const PanelHeader = memo<{
  onReset: () => void;
  onClose: () => void;
}>(({ onReset, onClose }) => {
  const { t } = useLocale();
  return (
    <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
      <h3 className="text-sm font-semibold text-gray-900">{t.flow.styleConfig}</h3>
      <div className="flex items-center gap-1">
        <button
          onClick={onReset}
          className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition-colors"
          title={t.flow.resetToDefault}
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
});

PanelHeader.displayName = "PanelHeader";

const ConfigPanelContent = memo<{
  styleConfig: StyleConfig;
  onChange: (key: keyof StyleConfig, value: number | string | boolean) => void;
  onReset: () => void;
  onClose: () => void;
}>(({ styleConfig, onChange, onReset, onClose }) => {
  const configGroups = useConfigGroups();

  return (
    <div className="w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto">
      <PanelHeader onReset={onReset} onClose={onClose} />

      <div className="p-3 space-y-4">
        {Object.entries(configGroups).map(([groupKey, group]) => (
          <ConfigGroup key={groupKey} groupKey={groupKey} group={group} styleConfig={styleConfig} onChange={onChange} />
        ))}
      </div>
    </div>
  );
});

ConfigPanelContent.displayName = "ConfigPanelContent";

interface StyleConfigPanelProps {
  styleConfig: StyleConfig;
  onStyleConfigChange: (config: StyleConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const StyleConfigPanel = memo<StyleConfigPanelProps>(({ styleConfig, onStyleConfigChange, isOpen, onClose }) => {
  const handleConfigChange = useCallback(
    (key: keyof StyleConfig, value: number | string | boolean) => {
      const newConfig = {
        ...styleConfig,
        [key]: value,
      };
      onStyleConfigChange(newConfig);
    },
    [styleConfig, onStyleConfigChange],
  );

  const resetToDefault = useCallback(() => {
    onStyleConfigChange(DEFAULT_STYLE_CONFIG);
  }, [onStyleConfigChange]);

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
          <div className="pointer-events-auto" onClick={handleContentClick}>
            <ConfigPanelContent
              styleConfig={styleConfig}
              onChange={handleConfigChange}
              onReset={resetToDefault}
              onClose={onClose}
            />
          </div>
        </div>
      )}
    </>
  );
});

StyleConfigPanel.displayName = "StyleConfigPanel";

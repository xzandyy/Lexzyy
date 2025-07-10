"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Pin, ChevronLeft, ChevronRight } from "lucide-react";
import { PanelHeader } from "@/components/common";
import useLocale from "@/hooks/use-locale";
import { PluginMeta } from "@/lib/plugin-manager/types";
import { pluginUIManager } from "@/lib/plugin-manager";

interface OpenPluginConfig {
  toolName: string;
  meta: PluginMeta;
  config: Record<string, any>;
  configUI: React.LazyExoticComponent<React.ComponentType<any>> | null;
}

interface RightSidebarProps {
  openPluginConfig: OpenPluginConfig | null;
  onConfigChange: (toolName: string, config: Record<string, any>) => void;
}

const PluginConfigPanel: React.FC<{
  openPluginConfig: OpenPluginConfig;
  onConfigChange: (toolName: string, config: Record<string, any>) => void;
}> = ({ openPluginConfig, onConfigChange }) => {
  const { t } = useLocale();
  const { toolName, meta, config, configUI: ConfigUI } = openPluginConfig;

  const handleConfigChange = (newConfig: Record<string, any>) => {
    onConfigChange(toolName, newConfig);
  };

  const IconUI = pluginUIManager.getIconUI(toolName);

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        label={
          <div className="flex items-center space-x-2">
            {IconUI && (
              <Suspense fallback={<div className="w-4 h-4 bg-blue-500 rounded animate-pulse"></div>}>
                <IconUI size={16} className="text-blue-600 dark:text-blue-400" />
              </Suspense>
            )}
            <span>{`${t.plugins.configPanel} - ${meta.name}`}</span>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-4">
        {ConfigUI ? (
          <ConfigUI config={config} onConfigChange={handleConfigChange} />
        ) : (
          <div className="text-center text-gray-500 py-8">
            <div className="text-lg mb-2">{t.plugins.noConfigUI}</div>
            <div className="text-sm">{t.plugins.noConfigUIDescription}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function RightSidebar({ openPluginConfig, onConfigChange }: RightSidebarProps) {
  const { t } = useLocale();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isOpen = openPluginConfig !== null;
  const isExpanded = isOpen && !isCollapsed;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && !isPinned && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsCollapsed(true);
      }
    };

    if (isExpanded) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isExpanded, isPinned]);

  useEffect(() => {
    if (!isOpen) {
      setIsPinned(false);
      setIsCollapsed(false);
    }
  }, [isOpen]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleTogglePin = () => {
    setIsPinned((prev) => !prev);
  };

  return (
    <motion.div
      ref={sidebarRef}
      initial={false}
      animate={{
        width: isOpen ? (isCollapsed ? 48 : 400) : 48,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="overflow-hidden z-100 border-l border-gray-200 shadow-sm ml:relative absolute right-0 top-0 bottom-0"
    >
      <div className="w-100 h-full flex bg-white">
        <div className="h-full w-12 flex flex-col border-r border-gray-200 shadow-sm">
          <div className="h-12 border-b border-gray-200 flex flex-col justify-center items-center">
            <button
              onClick={handleToggleCollapse}
              disabled={!isOpen}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded transition-colors ${
                !isOpen ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
              }`}
              title={isOpen ? (isCollapsed ? t.plugins.expand : t.plugins.collapse) : t.plugins.selectPlugin}
            >
              {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex-1 flex justify-center pt-2">
            <button
              onClick={handleTogglePin}
              disabled={!isOpen}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded transition-colors ${
                !isOpen
                  ? "text-gray-400 cursor-not-allowed"
                  : isPinned
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
              title={isOpen ? (isPinned ? t.plugins.unpin : t.plugins.pin) : t.plugins.selectPlugin}
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full">
          {openPluginConfig && !isCollapsed ? (
            <PluginConfigPanel openPluginConfig={openPluginConfig} onConfigChange={onConfigChange} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-lg mb-2">{t.plugins.selectPlugin}</div>
                <div className="text-sm">{t.plugins.selectPluginDescription}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

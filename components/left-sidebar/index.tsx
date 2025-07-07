import { LucideIcon, Menu } from "lucide-react";
import { ReactNode, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { KeepAlive } from "@/components/common";
import { useLocale } from "@/hooks/use-locale";
import TabButton from "./tab-button";

export interface LeftSidebarProps {
  defaultActiveTabId: string;
  tabs: {
    id: string;
    icon: LucideIcon;
    label: string;
    render: () => ReactNode;
    keepAlive?: boolean;
  }[];
}

export default function LeftSidebar({ tabs, defaultActiveTabId }: LeftSidebarProps) {
  const { t } = useLocale();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string | null>(defaultActiveTabId);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTabId(tabId);
      if (isCollapsed) {
        setIsCollapsed(false);
      }
    },
    [isCollapsed],
  );

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 56 : 4 * 110,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="overflow-hidden z-100 border-r border-gray-200 shadow-sm ml:relative absolute left-0 top-0 bottom-0"
    >
      <div className="w-110 h-full flex bg-white">
        <div className="h-full w-14 flex flex-col border-r border-gray-200 shadow-sm">
          {/* open/close */}
          <div className="h-12 border-b border-gray-200 flex flex-row space-x-1">
            <button
              onClick={handleToggleCollapse}
              className="flex-1 text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              title={t.sidebar.expandCollapse}
            >
              <Menu className="w-5 h-5 mx-auto" />
            </button>
          </div>

          {/* tabs */}
          <div className="flex-1 flex flex-col items-center py-2 space-y-1">
            {tabs.map((item) => (
              <TabButton
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTabId === item.id}
                onClick={handleTabClick}
              />
            ))}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col h-full">
          {tabs.map((tab) => (
            <KeepAlive
              key={tab.id}
              cacheKey={`sidebar-tab-${tab.id}`}
              active={activeTabId === tab.id}
              enabled={tab.keepAlive}
              immediate={false}
            >
              {tab.render}
            </KeepAlive>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

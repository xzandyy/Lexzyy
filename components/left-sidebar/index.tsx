import { LucideIcon, Menu } from "lucide-react";
import { ReactNode, useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import TabButton from "./tab-button";

export interface LeftSidebarProps {
  defaultActiveTabId: string;
  tabs: {
    id: string;
    icon: LucideIcon;
    label: string;
    component: ReactNode;
  }[];
}

const LeftSidebar = memo(function LeftSidebar({ tabs, defaultActiveTabId }: LeftSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string | null>(defaultActiveTabId);

  const currentItem = tabs.find((item) => item.id === activeTabId);

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
        width: isCollapsed ? 56 : 4 * (14 + 96),
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="bg-white border-r border-gray-200 h-full overflow-hidden flex z-100 shadow-sm"
    >
      <div className="h-full w-14 flex flex-col border-r border-gray-200 shadow-sm">
        {/* 展开/关闭 */}
        <div className="h-12 border-b border-gray-200 flex flex-row space-x-1">
          <button
            onClick={handleToggleCollapse}
            className="flex-1 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="展开/收起侧边栏"
          >
            <Menu className="w-5 h-5 mx-auto" />
          </button>
        </div>

        {/* 功能按钮 */}
        <div className="w-14 flex-1 flex flex-col items-center py-2 space-y-1">
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

      {/* 功能面板区域 */}
      <div className="flex flex-col h-full">
        <div className="h-12 border-b border-gray-200 flex items-center px-3">
          {currentItem && <h2 className="text-sm font-medium text-gray-900">{currentItem.label}</h2>}
        </div>
        <div className="w-96 flex-1 min-h-0">{currentItem && currentItem.component}</div>
      </div>
    </motion.div>
  );
});

export default LeftSidebar;

import { History, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LeftSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 56 : 256 + 56,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="absolute left-0 top-0 bottom-0 bg-white border-r border-gray-200 h-full overflow-hidden flex z-100 shadow-sm"
    >
      <div className="h-full w-14 flex flex-col border-r border-gray-200 shadow-sm">
        {/* 展开/关闭 */}
        <div className="h-12 border-b border-gray-200 flex flex-row space-x-1">
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex-1 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <Menu className="w-5 h-5 mx-auto" />
          </button>
        </div>

        {/* 功能按钮 */}
        <div className="w-14 flex-1 flex flex-col items-center py-2 space-y-1">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <History className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 对应功能区 */}
      <div className="flex flex-col h-full w-64">
        <div className="h-12 border-b border-gray-200"></div>
      </div>
    </motion.div>
  );
}

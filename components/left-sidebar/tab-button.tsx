import { memo } from "react";
import { LeftSidebarProps } from ".";

const TabButton = memo(function TabButton({
  item,
  isActive,
  onClick,
}: {
  item: LeftSidebarProps["tabs"][0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      key={item.id}
      onClick={onClick}
      className={`p-2 rounded transition-colors ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
      title={item.label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
});

export default TabButton;

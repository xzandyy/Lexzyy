import { memo } from "react";
import { LucideIcon } from "lucide-react";

const TabButton = memo(function TabButton({
  id,
  icon,
  label,
  isActive,
  onClick,
}: {
  id: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}) {
  const Icon = icon;

  return (
    <button
      onClick={() => onClick(id)}
      className={`p-2 cursor-pointer rounded transition-colors ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
});

export default TabButton;

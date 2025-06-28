import { memo } from "react";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  currentStatus: string;
  statusConfigs: Record<string, ActionConfig>;
}

const ActionButton = memo(function ActionButton({ currentStatus, statusConfigs }: ActionButtonProps) {
  const config = statusConfigs[currentStatus];

  if (!config) {
    return null;
  }

  const { tooltip, icon: IconComponent, disabled, onClick } = config;
  const isDisabled = typeof disabled === "function" ? disabled() : disabled;
  const className = `flex items-center justify-center text-white rounded-full transition-all duration-200 p-3 w-10 h-10 ${
    isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800 active:bg-gray-900"
  }`;

  return (
    <button type="button" onClick={onClick} disabled={isDisabled} className={className} title={tooltip}>
      <IconComponent className="w-4 h-4" />
    </button>
  );
});

export default ActionButton;
export type { ActionConfig, ActionButtonProps };

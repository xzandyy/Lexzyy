import { memo } from "react";
import { Send, Square, RefreshCcw } from "lucide-react";

interface ActionButtonProps {
  currentStatus: string;
  onSubmit: () => void;
  onStop: () => void;
  onReload: () => void;
  disabled?: boolean;
}

const ActionButton = memo(function ActionButton({
  currentStatus,
  onSubmit,
  onStop,
  onReload,
  disabled = false,
}: ActionButtonProps) {
  let IconComponent;
  let onClick;
  let tooltip;

  switch (currentStatus) {
    case "ready":
      IconComponent = Send;
      onClick = onSubmit;
      tooltip = "发送消息";
      break;
    case "streaming":
    case "submitted":
      IconComponent = Square;
      onClick = onStop;
      tooltip = "停止生成";
      break;
    case "error":
      IconComponent = RefreshCcw;
      onClick = onReload;
      tooltip = "重新生成";
      break;
    default:
      return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center text-white rounded-full transition-all duration-200 p-3 w-10 h-10 ${
        disabled ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800 active:bg-gray-900 cursor-pointer"
      }`}
      title={tooltip}
    >
      <IconComponent className="w-4 h-4" />
    </button>
  );
});

export default ActionButton;
export type { ActionButtonProps };

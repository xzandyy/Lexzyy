import { memo } from "react";
import { RefreshCcw, Send, Square } from "lucide-react";

interface SendButtonProps {
  status: "submitted" | "streaming" | "ready" | "error";
  sendDisabled: boolean;
  onStop: () => void;
  onReload: () => void;
}

const SendButton = memo(function SendButton({ status, sendDisabled, onStop, onReload }: SendButtonProps) {
  const baseClasses = "flex items-center space-x-2 p-3 text-white rounded-full transition-all duration-200";

  if (status === "ready") {
    return (
      <button
        type="submit"
        disabled={sendDisabled}
        className={`${baseClasses} ${sendDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
      >
        <Send className="w-4 h-4" />
      </button>
    );
  }

  if (status === "streaming" || status === "submitted") {
    return (
      <button type="button" onClick={onStop} className={`${baseClasses} bg-black hover:bg-gray-800`}>
        <Square className="w-4 h-4" />
      </button>
    );
  }

  if (status === "error") {
    return (
      <button type="button" onClick={onReload} className={`${baseClasses} bg-black hover:bg-gray-800`}>
        <RefreshCcw className="w-4 h-4" />
      </button>
    );
  }

  return null;
});

export default SendButton;

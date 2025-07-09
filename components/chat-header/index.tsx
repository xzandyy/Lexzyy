import { memo } from "react";
import { Bot } from "lucide-react";
import useLocale from "@/hooks/use-locale";

interface ChatHeaderProps {
  status: "submitted" | "streaming" | "ready" | "error";
  error?: Error | null;
}

const ChatHeader = memo(function ChatHeader({ status }: ChatHeaderProps) {
  const { t } = useLocale();

  return (
    <div className="h-12 bg-white border-b border-gray-200 z-10">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6 text-gray-700" />
          <h1 className="text-lg font-semibold text-gray-900">Lexzyy</h1>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {status === "submitted" && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t.chat.waitingForReply}</span>
            </>
          )}
          {status === "streaming" && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t.chat.replying}</span>
            </>
          )}
          {status === "ready" && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t.chat.online}</span>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{t.chat.error}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatHeader;

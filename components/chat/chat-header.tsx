import { Bot } from "lucide-react";

interface ChatHeaderProps {
  status: "submitted" | "streaming" | "ready" | "error";
  error?: Error | null;
}

export default function ChatHeader({ status }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 z-10">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6 text-gray-700" />
          <h1 className="text-lg font-semibold text-gray-900">Frychic</h1>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {(status === "streaming" || status === "submitted") && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>正在回复...</span>
            </>
          )}
          {status === "ready" && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>在线</span>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>错误</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

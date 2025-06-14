import { RefreshCcw, Send, Square } from "lucide-react";

interface ChatInputProps {
  input: string;
  status: "submitted" | "streaming" | "ready" | "error";
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStop: () => void;
  onReload: () => void;
}

export default function ChatInput({ input, status, onInputChange, onSubmit, onStop, onReload }: ChatInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 184) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
      (e.target as HTMLTextAreaElement).style.height = "40px";
    }
  };

  return (
    <div className="p-6 pt-0">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={onSubmit}>
          <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm border border-gray-300 overflow-hidden">
            {/* 输入框区域 */}
            <div className="px-4 py-1">
              <textarea
                placeholder="发送消息给 Lexzyy..."
                className="w-full pt-3 pb-1 min-h-[40px] focus:outline-none resize-none text-gray-800"
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* 底部操作栏 */}
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
              <div className="flex items-center justify-between">
                {/* 左侧区域 - 预留给未来功能 */}
                <div className="flex items-center space-x-2">{/* 这里可以添加附件等功能按钮 */}</div>

                {/* 右侧发送/暂停按钮 */}
                <div className="flex items-center space-x-2">
                  {(status === "streaming" || status === "submitted") && (
                    <button
                      type="button"
                      onClick={onStop}
                      className="flex items-center space-x-2 p-3 bg-black hover:bg-gray-800 text-white rounded-full transition-all duration-200"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  )}
                  {status === "ready" && (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="flex items-center space-x-2 p-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  {status === "error" && (
                    <button
                      type="button"
                      onClick={onReload}
                      className="flex items-center space-x-2 p-3 bg-black hover:bg-gray-800 text-white rounded-full transition-all duration-200"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

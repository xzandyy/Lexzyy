import { RefreshCcw, Send, Square, Paperclip, X, FileText, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

interface ChatInputProps {
  input: ReturnType<typeof useChat>["input"];
  status: ReturnType<typeof useChat>["status"];
  onInputChange: ReturnType<typeof useChat>["handleInputChange"];
  onSubmit: ReturnType<typeof useChat>["handleSubmit"];
  onStop: ReturnType<typeof useChat>["stop"];
  onReload: ReturnType<typeof useChat>["reload"];
}

export default function ChatInput({ input, status, onInputChange, onSubmit, onStop, onReload }: ChatInputProps) {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 184) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
      (e.target as HTMLTextAreaElement).style.height = "40px";
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    onSubmit(e, {
      experimental_attachments: files,
    });

    // 清理文件选择
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    if (!files) return;

    const dt = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      if (i !== indexToRemove) {
        dt.items.add(files[i]);
      }
    }
    setFiles(dt.files.length > 0 ? dt.files : undefined);
  };

  const clearAllFiles = () => {
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const hasFiles = files && files.length > 0;

  return (
    <div className="p-6 pt-0">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleFormSubmit}>
          <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm border border-gray-300 overflow-hidden">
            {/* 文件预览区域 */}
            {hasFiles && (
              <div className="px-4 pt-3 border-b border-gray-100">
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.from(files).map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm">
                      {getFileIcon(file)}
                      <span className="text-gray-700 max-w-[150px] truncate">{file.name}</span>
                      <span className="text-gray-500 text-xs">({formatFileSize(file.size)})</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-gray-600 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearAllFiles}
                  className="text-xs text-gray-500 hover:text-gray-700 mb-2"
                >
                  清除所有文件
                </button>
              </div>
            )}

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
                {/* 左侧区域 - 附件按钮 */}
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*,text/*,.pdf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={status !== "ready"}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="添加附件 (支持图片、文本文件、PDF)"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>

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
                      onClick={() => onReload()}
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

import { RefreshCcw, Send, Square, Paperclip, X, FileText, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { UseAttachmentsReturn } from "@/hooks/use-attachments";

interface ChatInputProps {
  input: string;
  status: "submitted" | "streaming" | "ready" | "error";
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent, options?: { experimental_attachments?: FileList }) => void;
  onStop: () => void;
  onReload: () => void;
  attachments: UseAttachmentsReturn;
}

export default function ChatInput({
  input,
  status,
  onInputChange,
  onSubmit,
  onStop,
  onReload,
  attachments,
}: ChatInputProps) {
  const {
    files,
    removeFile,
    retryFile,
    clearAllFiles,
    fileInputRef,
    handleFileSelect,
    hasLoadingFiles,
    getFileListForSubmit,
  } = attachments;

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
    const fileList = getFileListForSubmit();
    onSubmit(e, {
      experimental_attachments: fileList,
    });
    clearAllFiles();
  };

  const getFileIcon = (originalType: string) => {
    if (originalType.startsWith("image/")) {
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

  const getStatusColor = (fileStatus: string) => {
    switch (fileStatus) {
      case "success":
        return "bg-green-100 border-green-200";
      case "loading":
        return "bg-blue-100 border-blue-200";
      case "error":
        return "bg-red-100 border-red-200";
      default:
        return "bg-gray-100 border-gray-200";
    }
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
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border ${getStatusColor(file.status)}`}
                    >
                      {getFileIcon(file.originalType)}
                      <span className="text-gray-700 max-w-[150px] truncate">{file.originalName}</span>
                      <span className="text-gray-500 text-xs">({formatFileSize(file.file.size)})</span>

                      {/* 状态指示器 */}
                      {file.status === "loading" && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                      {file.status === "error" && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <button
                            type="button"
                            onClick={() => retryFile(file.id)}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                            title={file.error || "重试"}
                          >
                            重试
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-gray-600 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 文件操作按钮 */}
                <div className="flex items-center justify-between mb-2">
                  <button type="button" onClick={clearAllFiles} className="text-xs text-gray-500 hover:text-gray-700">
                    清除所有文件
                  </button>

                  {hasLoadingFiles && (
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      正在处理文件...
                    </span>
                  )}
                </div>
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
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={status !== "ready"}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="添加附件"
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
                      disabled={!input.trim() || hasLoadingFiles}
                      className="flex items-center space-x-2 p-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200"
                      title={hasLoadingFiles ? "等待文件处理完成" : "发送消息"}
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

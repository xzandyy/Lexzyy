import { X, FileText, Loader2, AlertCircle } from "lucide-react";
import { ChatAttachment } from "@/lib/file-utils";

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + ["B", "KB", "MB", "GB"][i];
}

interface FileItemProps {
  file: ChatAttachment;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

export default function FileItem({ file, onRemove, onRetry }: FileItemProps) {
  const filename = file.originalName;
  const size = formatFileSize(file.file.size);
  const fileIsLoading = file.status === "loading";
  const hasError = file.status === "error";

  const handleRemove = () => {
    onRemove(file.id);
  };

  const handleRetry = () => {
    onRetry(file.id);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm border bg-gray-100 border-gray-200">
      <FileText className="w-4 h-4" />
      <span className="text-gray-700 max-w-[150px] truncate">{filename}</span>
      <span className="text-gray-500 text-xs">({size})</span>

      {fileIsLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
      {hasError && (
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-red-500" />
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs text-red-600 hover:text-red-800 underline"
            title={file.error || "重试"}
          >
            重试
          </button>
        </div>
      )}

      <button type="button" onClick={handleRemove} className="text-gray-400 hover:text-gray-600 ml-1">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

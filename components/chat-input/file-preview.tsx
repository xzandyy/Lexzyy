import { memo } from "react";
import { Loader2 } from "lucide-react";
import { ChatAttachment } from "@/lib/file-utils";
import FileItem from "./file-item";

interface FilePreviewProps {
  files: ChatAttachment[];
  hasLoadingFiles: boolean;
  onRemoveFile: (id: string) => void;
  onRetryFile: (id: string) => void;
  onClearAllFiles: () => void;
}

const FilePreview = memo(function FilePreview({
  files,
  hasLoadingFiles,
  onRemoveFile,
  onRetryFile,
  onClearAllFiles,
}: FilePreviewProps) {
  return (
    <div className="px-4 pt-3 border-b border-gray-100">
      <div className="flex flex-wrap gap-2 mb-3">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onRemove={onRemoveFile} onRetry={onRetryFile} />
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={onClearAllFiles} className="text-xs text-gray-500 hover:text-gray-700">
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
  );
});

export default FilePreview;

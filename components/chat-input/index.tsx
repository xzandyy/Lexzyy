import { memo, useCallback } from "react";
import { Send, Square, RefreshCcw } from "lucide-react";
import TextInput from "./text-input";
import FilePreview from "./file-preview";
import ActionButton, { ActionConfig } from "./action-button";
import AttachmentButton from "./attachment-button";
import useTheChat from "@/hooks/use-the-chat";
import DragDropOverlay from "./drag-drop-overlay";
import useAttachments from "@/hooks/use-attachments";

interface ChatInputProps {
  input: ReturnType<typeof useTheChat>["input"];
  status: ReturnType<typeof useTheChat>["status"];
  onInputChange: ReturnType<typeof useTheChat>["handleInputChange"];
  onSubmit: ReturnType<typeof useTheChat>["handleSubmit"];
  onStop: ReturnType<typeof useTheChat>["stop"];
  onReload: ReturnType<typeof useTheChat>["reload"];
}

const ChatInput = memo(function ChatInput({
  input,
  status,
  onInputChange,
  onSubmit,
  onStop,
  onReload,
}: ChatInputProps) {
  const { files, hasLoadingFiles, addFiles, removeFile, retryFile, clearAllFiles, getFileListForSubmit } =
    useAttachments();
  const inputPlaceholder = "发送消息给 Lexzyy...";

  const handleSubmit = useCallback(() => {
    const files = getFileListForSubmit();
    if (files) {
      onSubmit({
        experimental_attachments: files,
      });
    }
  }, [onSubmit, getFileListForSubmit]);

  const statusConfigs: Record<string, ActionConfig> = {
    ready: {
      icon: Send,
      onClick: onSubmit,
      disabled: () => !input.trim() || hasLoadingFiles,
      tooltip: "发送消息",
    },
    streaming: {
      icon: Square,
      onClick: onStop,
      tooltip: "停止生成",
    },
    submitted: {
      icon: Square,
      onClick: onStop,
      tooltip: "停止生成",
    },
    error: {
      icon: RefreshCcw,
      onClick: onReload,
      tooltip: "重新生成",
    },
  };

  return (
    <div className="p-6 pt-0">
      <div className="max-w-4xl mx-auto">
        <form>
          <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm border border-gray-300 overflow-hidden">
            {files.length > 0 && (
              <FilePreview
                files={files}
                isLoading={hasLoadingFiles}
                onRemoveFile={removeFile}
                onRetryFile={retryFile}
                onClearAllFiles={clearAllFiles}
              />
            )}

            <TextInput onChange={onInputChange} onEnter={handleSubmit} placeholder={inputPlaceholder} />

            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DragDropOverlay onFilesDrop={addFiles} />
                  <AttachmentButton onFilesSelect={addFiles} />
                </div>

                <div className="flex items-center space-x-2">
                  <ActionButton currentStatus={status} statusConfigs={statusConfigs} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ChatInput;

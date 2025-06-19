import { memo, useCallback } from "react";
import useAttachments from "@/hooks/use-attachments";
import DragDropOverlay from "@/components/chat-input/drag-drop-overlay";
import TextInput from "./text-input";
import FilePreview from "./file-preview";
import SendButton from "./send-button";
import AttachmentButton from "./attachment-button";

interface ChatInputProps {
  input: string;
  status: "submitted" | "streaming" | "ready" | "error";
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent, options?: { experimental_attachments?: FileList }) => void;
  onStop: () => void;
  onReload: () => void;
}

const ChatInput = memo(function ChatInput({
  input,
  status,
  onInputChange,
  onSubmit,
  onStop,
  onReload,
}: ChatInputProps) {
  const {
    files,
    removeFile,
    retryFile,
    clearAllFiles,
    fileInputRef,
    handleFileSelect,
    handleFileInputClick,
    hasLoadingFiles,
    getFileListForSubmit,
    isDragOver,
  } = useAttachments();

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const fileList = getFileListForSubmit();
      onSubmit(e, {
        experimental_attachments: fileList,
      });
      clearAllFiles();
    },
    [getFileListForSubmit, onSubmit, clearAllFiles],
  );

  return (
    <>
      <DragDropOverlay isVisible={isDragOver} />

      <div className="p-6 pt-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleFormSubmit}>
            <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm border border-gray-300 overflow-hidden">
              {files.length > 0 && (
                <FilePreview
                  files={files}
                  hasLoadingFiles={hasLoadingFiles}
                  onRemoveFile={removeFile}
                  onRetryFile={retryFile}
                  onClearAllFiles={clearAllFiles}
                />
              )}

              <TextInput value={input} onChange={onInputChange} onSubmit={handleFormSubmit} />

              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AttachmentButton
                      fileInputRef={fileInputRef}
                      onFileSelect={handleFileSelect}
                      onFileInputClick={handleFileInputClick}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <SendButton
                      status={status}
                      sendDisabled={!input.trim() || hasLoadingFiles}
                      onStop={onStop}
                      onReload={onReload}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
});

export default ChatInput;

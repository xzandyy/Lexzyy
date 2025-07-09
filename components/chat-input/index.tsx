import { memo, useCallback } from "react";
import TextInput from "./text-input";
import FilePreview from "./file-preview";
import ActionButton from "./action-button";
import AttachmentButton from "./attachment-button";
import DragDropOverlay from "./drag-drop-overlay";
import useAttachments from "@/hooks/use-attachments";
import useInputText from "@/hooks/use-input-text";
import useLocale from "@/hooks/use-locale";
import { ChatRequestOptions } from "ai";

interface ChatInputProps {
  status: "ready" | "submitted" | "streaming" | "error";
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (chatRequestOptions?: ChatRequestOptions) => void;
  onStop: () => void;
  onReload: (chatRequestOptions?: ChatRequestOptions) => void;
}

const ChatInput = memo(function ChatInput({ status, onInputChange, onSubmit, onStop, onReload }: ChatInputProps) {
  const { t } = useLocale();
  const { files, hasFiles, hasLoadingFiles, addFiles, removeFile, retryFile, clearAllFiles, getFileListForSubmit } =
    useAttachments();

  const submitWithAttachments = useCallback(() => {
    const files = getFileListForSubmit();
    if (files) {
      onSubmit({
        experimental_attachments: files,
      });
    }
  }, [onSubmit, getFileListForSubmit]);

  const { input, handleInputChange, handleEnter, clearInput } = useInputText(onInputChange, submitWithAttachments);

  const handleSubmit = useCallback(() => {
    submitWithAttachments();
    clearInput();
  }, [submitWithAttachments, clearInput]);

  const isActionDisabled = status === "ready" ? !input.trim() || hasLoadingFiles : false;

  return (
    <div className="p-6 pt-0">
      <div className="max-w-4xl mx-auto">
        <DragDropOverlay onFilesDrop={addFiles} />
        <form>
          <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm border border-gray-300 overflow-hidden">
            {hasFiles && (
              <FilePreview
                files={files}
                isLoading={hasLoadingFiles}
                onRemoveFile={removeFile}
                onRetryFile={retryFile}
                onClearAllFiles={clearAllFiles}
              />
            )}
            <TextInput
              input={input}
              onChange={handleInputChange}
              onEnter={handleEnter}
              placeholder={t.chat.placeholder}
            />
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AttachmentButton onFilesSelect={addFiles} />
                </div>
                <div className="flex items-center space-x-2">
                  <ActionButton
                    currentStatus={status}
                    onSubmit={handleSubmit}
                    onStop={onStop}
                    onReload={onReload}
                    disabled={isActionDisabled}
                  />
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

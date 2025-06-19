import { memo } from "react";
import { Paperclip } from "lucide-react";

interface AttachmentButtonProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileInputClick: () => void;
}

const AttachmentButton = memo(function AttachmentButton({
  fileInputRef,
  onFileSelect,
  onFileInputClick,
}: AttachmentButtonProps) {
  return (
    <>
      <input type="file" ref={fileInputRef} onChange={onFileSelect} multiple className="hidden" />
      <button
        type="button"
        onClick={onFileInputClick}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="添加附件"
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </>
  );
});

export default AttachmentButton;

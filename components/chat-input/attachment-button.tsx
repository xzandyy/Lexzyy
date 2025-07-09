import { memo } from "react";
import { Paperclip } from "lucide-react";
import useInputFile from "@/hooks/use-input-file";
import useLocale from "@/hooks/use-locale";

interface AttachmentButtonProps {
  onFilesSelect: (files: FileList) => void;
}

const AttachmentButton = memo(function AttachmentButton({ onFilesSelect }: AttachmentButtonProps) {
  const { t } = useLocale();
  const { fileInputRef, handleFileSelect, handleFileInputClick } = useInputFile(onFilesSelect);
  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
      <button
        type="button"
        onClick={handleFileInputClick}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={t.chat.addAttachment}
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </div>
  );
});

export default AttachmentButton;

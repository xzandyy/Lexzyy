import { useCallback, useRef } from "react";

export default function useInputFile(onFileSelect: (files: FileList) => void) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        onFileSelect(e.target.files);
      }
    },
    [onFileSelect],
  );

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleFileSelect,
    handleFileInputClick,
  };
}

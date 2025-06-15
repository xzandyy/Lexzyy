import { useState, useCallback, useRef, useEffect } from "react";

export interface UseAttachmentsReturn {
  files: FileList | undefined;
  isDragOver: boolean;
  addFiles: (newFiles: FileList) => void;
  removeFile: (indexToRemove: number) => void;
  clearAllFiles: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function useAttachments(): UseAttachmentsReturn {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);

  const addFiles = useCallback(
    (newFiles: FileList) => {
      if (newFiles.length === 0) return;

      if (!files || files.length === 0) {
        setFiles(newFiles);
      } else {
        // 合并现有文件和新文件
        const dt = new DataTransfer();
        for (let i = 0; i < files.length; i++) {
          dt.items.add(files[i]);
        }
        for (let i = 0; i < newFiles.length; i++) {
          dt.items.add(newFiles[i]);
        }
        setFiles(dt.files);
      }
    },
    [files],
  );

  const removeFile = useCallback(
    (indexToRemove: number) => {
      if (!files) return;

      const dt = new DataTransfer();
      for (let i = 0; i < files.length; i++) {
        if (i !== indexToRemove) {
          dt.items.add(files[i]);
        }
      }
      setFiles(dt.files.length > 0 ? dt.files : undefined);
    },
    [files],
  );

  const clearAllFiles = useCallback(() => {
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles],
  );

  // 拖拽事件处理
  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      dragCounterRef.current = 0;
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  useEffect(() => {
    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);

    return () => {
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    };
  }, [onDragEnter, onDragLeave, onDragOver, onDrop]);

  return {
    files,
    addFiles,
    removeFile,
    clearAllFiles,
    isDragOver,
    fileInputRef,
    handleFileSelect,
  };
}

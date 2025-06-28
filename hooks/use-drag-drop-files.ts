import { useCallback, useEffect, useState } from "react";

export default function useDragDropFiles(onDropFiles: (files: FileList) => void) {
  const [isFilesDragOver, setIsFilesDragOver] = useState(false);

  const handleDragEvent = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer?.types?.includes("Files")) {
      return;
    }
  }, []);

  const onDragEnter = useCallback(
    (e: DragEvent) => {
      handleDragEvent(e);
      if (e.dataTransfer?.items?.length) {
        setIsFilesDragOver(true);
      }
    },
    [handleDragEvent],
  );

  const onDragLeave = useCallback(
    (e: DragEvent) => {
      handleDragEvent(e);
      setIsFilesDragOver(false);
    },
    [handleDragEvent],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      handleDragEvent(e);
      setIsFilesDragOver(false);

      if (e.dataTransfer?.files?.length) {
        onDropFiles(e.dataTransfer.files);
      }
    },
    [onDropFiles, handleDragEvent],
  );

  useEffect(() => {
    document.addEventListener("dragover", handleDragEvent);
    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);

    return () => {
      document.removeEventListener("dragover", handleDragEvent);
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop", onDrop);
    };
  }, [handleDragEvent, onDragEnter, onDragLeave, onDrop]);

  return {
    isFilesDragOver,
  };
}

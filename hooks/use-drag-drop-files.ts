import { useCallback, useEffect, useState, useRef } from "react";

export default function useDragDropFiles(onDropFiles: (files: FileList) => void) {
  const [isFilesDragOver, setIsFilesDragOver] = useState(false);
  const dragCounterRef = useRef(0);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragEvent = useCallback((e: DragEvent) => {
    if (!e.dataTransfer?.types?.includes("Files")) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragEnter = useCallback(
    (e: DragEvent) => {
      handleDragEvent(e);

      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }

      dragCounterRef.current++;

      if (e.dataTransfer?.items?.length && !isFilesDragOver) {
        setIsFilesDragOver(true);
      }
    },
    [handleDragEvent, isFilesDragOver],
  );

  const onDragLeave = useCallback(
    (e: DragEvent) => {
      handleDragEvent(e);

      dragCounterRef.current--;

      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;

        leaveTimeoutRef.current = setTimeout(() => {
          setIsFilesDragOver(false);
          leaveTimeoutRef.current = null;
        }, 200);
      }
    },
    [handleDragEvent],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      handleDragEvent(e);

      dragCounterRef.current = 0;
      setIsFilesDragOver(false);

      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }

      if (e.dataTransfer?.files?.length) {
        onDropFiles(e.dataTransfer.files);
      }
    },
    [onDropFiles, handleDragEvent],
  );

  const onDragOver = useCallback(
    (e: DragEvent) => {
      handleDragEvent(e);
    },
    [handleDragEvent],
  );

  useEffect(() => {
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);

    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop", onDrop);

      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, [onDragOver, onDragEnter, onDragLeave, onDrop]);

  return {
    isFilesDragOver,
  };
}

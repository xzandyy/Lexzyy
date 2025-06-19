import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { ChatAttachment, FileStatus, processFile, isFileSupported } from "@/lib/file-utils";

export interface UseAttachmentsReturn {
  files: ChatAttachment[];
  isDragOver: boolean;
  addFiles: (newFiles: FileList) => void;
  removeFile: (id: string) => void;
  retryFile: (id: string) => void;
  clearAllFiles: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileInputClick: () => void;
  hasLoadingFiles: boolean;
  getFileListForSubmit: () => FileList | undefined;
}

export default function useAttachments(): UseAttachmentsReturn {
  const [files, setFiles] = useState<ChatAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);

  const addFiles = useCallback(async (newFiles: FileList) => {
    if (newFiles.length === 0) return;

    const fileArray = Array.from(newFiles);
    const supportedFiles: Array<ChatAttachment> = [];

    // 先检查所有文件并创建条目
    for (const file of fileArray) {
      if (!isFileSupported(file)) {
        toast.error(`不支持的文件类型: ${file.name}`, {
          duration: 3000,
          icon: "❌",
        });
        continue;
      }

      const newFileEntry: ChatAttachment = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        file,
        status: "pending" as FileStatus,
        originalName: file.name,
        originalType: file.type,
      };

      supportedFiles.push(newFileEntry);
    }

    // 一次性添加所有支持的文件到状态
    if (supportedFiles.length > 0) {
      setFiles((prev) => [...prev, ...supportedFiles]);

      // 并行处理所有文件
      const processPromises = supportedFiles.map(async (file) => {
        try {
          const processedFile = await processFile(file.file);
          setFiles((prev) => prev.map((f) => (f.id === file.id ? processedFile : f)));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "处理失败";
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, status: "error" as FileStatus, error: errorMessage } : f)),
          );

          // 显示处理失败的toast
          toast.error(`${file.file.name}: ${errorMessage}`, {
            duration: 5000,
            icon: "❌",
          });
        }
      });

      // 等待所有文件处理完成
      await Promise.allSettled(processPromises);
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const retryFile = useCallback(
    async (id: string) => {
      const fileEntry = files.find((f) => f.id === id);
      if (!fileEntry) return;

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "loading" as FileStatus, error: undefined } : f)),
      );

      try {
        const processedFile = await processFile(fileEntry.file);
        setFiles((prev) => prev.map((f) => (f.id === id ? processedFile : f)));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "重试失败";
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "error" as FileStatus, error: errorMessage } : f)),
        );

        // 显示重试失败的toast
        toast.error(`${fileEntry.originalName}: ${errorMessage}`, {
          duration: 5000,
          icon: "❌",
        });
      }
    },
    [files],
  );

  const clearAllFiles = useCallback(() => {
    setFiles([]);
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

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 获取用于提交的FileList
  const getFileListForSubmit = useCallback((): FileList | undefined => {
    const successFiles = files.filter((f) => f.status === "success");
    if (successFiles.length === 0) return undefined;

    const dt = new DataTransfer();
    successFiles.forEach((f) => dt.items.add(f.file));
    return dt.files;
  }, [files]);

  // 是否有正在加载的文件
  const hasLoadingFiles = files.some((f) => f.status === "loading");

  // 拖拽事件处理
  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 检查是否包含文件，只有拖拽文件时才响应
    if (!e.dataTransfer?.types?.includes("Files")) {
      return;
    }

    dragCounterRef.current++;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 检查是否包含文件，只有拖拽文件时才响应
    if (!e.dataTransfer?.types?.includes("Files")) {
      return;
    }

    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 检查是否包含文件，只有拖拽文件时才响应
    if (!e.dataTransfer?.types?.includes("Files")) {
      return;
    }
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 检查是否包含文件，只有拖拽文件时才响应
      if (!e.dataTransfer?.types?.includes("Files")) {
        return;
      }

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
    retryFile,
    clearAllFiles,
    isDragOver,
    fileInputRef,
    handleFileSelect,
    handleFileInputClick,
    hasLoadingFiles,
    getFileListForSubmit,
  };
}

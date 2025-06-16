import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export type FileStatus = "pending" | "loading" | "success" | "error";

export interface ChatAttachment {
  id: string;
  file: File;
  status: FileStatus;
  originalName: string;
  originalType: string;
  dataUrl?: string;
  error?: string;
}

export interface UseAttachmentsReturn {
  files: ChatAttachment[];
  isDragOver: boolean;
  addFiles: (newFiles: FileList) => void;
  removeFile: (id: string) => void;
  retryFile: (id: string) => void;
  clearAllFiles: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasLoadingFiles: boolean;
  getFileListForSubmit: () => FileList | undefined;
}

// 支持的文档类型
const SUPPORTED_DOCUMENT_TYPES = [
  // Office文档
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/msword", // doc
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel", // xls
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "application/vnd.ms-powerpoint", // ppt
  "application/xml", // xml
  "application/json", // json
  "application/xhtml+xml", // xhtml
  "application/x-latex", // tex
  "application/x-tex", // tex
  "application/x-yaml", // yml
  "application/rss+xml", // rss
  "application/atom+xml", // atom
];

// 检查文件是否支持
function isFileSupported(file: File): boolean {
  return (
    file.type.startsWith("image/") || file.type.startsWith("text/") || SUPPORTED_DOCUMENT_TYPES.includes(file.type)
  );
}

// 文档转换API
async function convertDocumentToText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/convert-document", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `转换失败: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // 如果解析JSON失败，使用默认错误消息
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data.text;
}

// 创建Data URL
function createTextDataUrl(text: string): string {
  return `data:text/plain;base64,${btoa(unescape(encodeURIComponent(text)))}`;
}

export default function useAttachments(): UseAttachmentsReturn {
  const [files, setFiles] = useState<ChatAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);

  // 处理单个文件
  const processFile = useCallback(async (file: File): Promise<ChatAttachment | null> => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const isImage = file.type.startsWith("image/");
    const isText = file.type.startsWith("text/");
    const isDocument = SUPPORTED_DOCUMENT_TYPES.includes(file.type);

    // 检查是否支持该文件类型
    if (!isFileSupported(file)) {
      toast.error(`不支持的文件类型: ${file.name}`, {
        duration: 3000,
        icon: "❌",
      });
      return null; // 直接跳过不支持的文件
    }

    const fileWithStatus: ChatAttachment = {
      id,
      file,
      status: "pending",
      originalName: file.name,
      originalType: file.type,
    };

    // 图片和文本文件直接成功
    if (isImage || isText) {
      fileWithStatus.status = "success";
      return fileWithStatus;
    }

    // 文档类型需要转换
    if (isDocument) {
      fileWithStatus.status = "loading";
      try {
        const text = await convertDocumentToText(file);
        const dataUrl = createTextDataUrl(text);

        // 创建新的文本文件
        const textFile = new File([text], file.name, { type: "text/plain" });

        fileWithStatus.file = textFile;
        fileWithStatus.dataUrl = dataUrl;
        fileWithStatus.status = "success";
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "转换失败";
        fileWithStatus.error = errorMessage;
        fileWithStatus.status = "error";

        // 显示错误toast：文件名 + 错误原因
        toast.error(`${file.name}: ${errorMessage}`, {
          duration: 5000,
          icon: "❌",
        });
      }
      return fileWithStatus;
    }

    return fileWithStatus;
  }, []);

  const addFiles = useCallback(
    async (newFiles: FileList) => {
      if (newFiles.length === 0) return;

      const fileArray = Array.from(newFiles);

      // 处理每个文件
      for (const file of fileArray) {
        // 检查是否支持，不支持的直接显示toast并跳过
        if (!isFileSupported(file)) {
          toast.error(`不支持的文件类型: ${file.name}`, {
            duration: 3000,
            icon: "❌",
          });
          continue; // 跳过这个文件
        }

        // 支持的文件添加到状态
        const newFileEntry: ChatAttachment = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          status: "pending" as FileStatus,
          originalName: file.name,
          originalType: file.type,
        };

        setFiles((prev) => [...prev, newFileEntry]);

        // 处理文件
        try {
          const processedFile = await processFile(file);
          if (processedFile) {
            setFiles((prev) => prev.map((f) => (f.id === newFileEntry.id ? processedFile : f)));
          } else {
            // 如果processFile返回null，从列表中移除该文件
            setFiles((prev) => prev.filter((f) => f.id !== newFileEntry.id));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "处理失败";
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFileEntry.id ? { ...f, status: "error" as FileStatus, error: errorMessage } : f,
            ),
          );

          // 显示处理失败的toast
          toast.error(`${file.name}: ${errorMessage}`, {
            duration: 5000,
            icon: "❌",
          });
        }
      }
    },
    [processFile],
  );

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
        if (processedFile) {
          setFiles((prev) => prev.map((f) => (f.id === id ? processedFile : f)));
        }
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
    [files, processFile],
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

  // 获取用于提交的FileList
  const getFileListForSubmit = useCallback((): FileList | undefined => {
    const successFiles = files.filter((f) => f.status === "success");
    if (successFiles.length === 0) return undefined;

    const dt = new DataTransfer();
    successFiles.forEach((f) => dt.items.add(f.file));
    return dt.files;
  }, [files]);

  // 是否有正在加载的文件
  const hasLoadingFiles = files.some((f) => f.status !== "success");

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
    retryFile,
    clearAllFiles,
    isDragOver,
    fileInputRef,
    handleFileSelect,
    hasLoadingFiles,
    getFileListForSubmit,
  };
}

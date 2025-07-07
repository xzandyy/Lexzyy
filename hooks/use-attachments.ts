import { ChatAttachment, FileStatus, isFileSupported, processFile } from "@/lib/file-utils";
import { useCallback, useState } from "react";
import { useLocale } from "@/hooks/use-locale";
import toast from "react-hot-toast";

export default function useAttachments() {
  const { t } = useLocale();
  const [files, setFiles] = useState<ChatAttachment[]>([]);
  const hasFiles = files.length > 0;
  const hasLoadingFiles = files.some((f) => f.status === "loading");

  const addFiles = useCallback(
    async (newFiles: FileList) => {
      if (newFiles.length === 0) return;

      const supportedFiles: Array<ChatAttachment> = Array.from(newFiles)
        .filter((file) => {
          if (!isFileSupported(file)) {
            toast.error(`${t.chat.unsupportedFileType}: ${file.name}`, { duration: 3000, icon: "❌" });
            return false;
          }
          return true;
        })
        .map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          file,
          status: "pending" as FileStatus,
          originalName: file.name,
          originalType: file.type,
        }));

      if (supportedFiles.length > 0) {
        setFiles((prev) => [...prev, ...supportedFiles]);

        await Promise.allSettled(
          supportedFiles.map(async (file) => {
            try {
              const processedFile = await processFile(file.file);
              setFiles((prev) => prev.map((f) => (f.id === file.id ? processedFile : f)));
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : t.chat.processingFailed;
              setFiles((prev) =>
                prev.map((f) => (f.id === file.id ? { ...f, status: "error" as FileStatus, error: errorMessage } : f)),
              );
            }
          }),
        );
      }
    },
    [t.chat.unsupportedFileType, t.chat.processingFailed],
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
        setFiles((prev) => prev.map((f) => (f.id === id ? processedFile : f)));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t.chat.retryFailed;
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "error" as FileStatus, error: errorMessage } : f)),
        );
      }
    },
    [files, t.chat.retryFailed],
  );

  const clearAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const getFileListForSubmit = useCallback((): FileList | undefined => {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f.file));
    return dt.files;
  }, [files]);

  return {
    files,
    hasFiles,
    hasLoadingFiles,
    addFiles,
    removeFile,
    retryFile,
    clearAllFiles,
    getFileListForSubmit,
  };
}

import toast from "react-hot-toast";
import { getActualMimeType } from "./mime-detector";
import { isImageFile, isTextFile, isDocumentFile } from "./file-type-checker";
import { convertDocumentToText, createTextDataUrl } from "./document-converter";

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

// 处理单个文件
export async function processFile(file: File): Promise<ChatAttachment> {
  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  // 获取实际的MIME类型（浏览器识别的或根据扩展名推断的）
  const actualMimeType = getActualMimeType(file);

  const isImage = isImageFile(actualMimeType);
  const isText = isTextFile(actualMimeType);
  const isDocument = isDocumentFile(actualMimeType);

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
      // 如果原文件MIME类型为空，创建一个带有正确MIME类型的新File对象
      const fileToProcess = file.type ? file : new File([file], file.name, { type: actualMimeType });

      const text = await convertDocumentToText(fileToProcess);
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
  }

  return fileWithStatus;
}

import { getMimeTypeByExtension } from "./mime-detector";

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

  // 结构化文档
  "application/xml", // xml
  "text/xml", // xml
  "application/json", // json
  "application/xhtml+xml", // xhtml

  // LaTeX文档
  "application/x-latex", // tex
  "application/x-tex", // tex

  // YAML配置文件
  "application/x-yaml", // yml
  "text/yaml", // yaml
  "text/x-yaml", // yml/yaml

  // RSS和Atom订阅
  "application/rss+xml", // rss
  "application/atom+xml", // atom
];

// 检查文件是否支持
export function isFileSupported(file: File): boolean {
  // 优先使用浏览器识别的MIME类型
  if (file.type) {
    if (
      file.type.startsWith("image/") ||
      file.type.startsWith("text/") ||
      SUPPORTED_DOCUMENT_TYPES.includes(file.type)
    ) {
      return true;
    }
  }

  // 如果MIME类型为空或不支持，尝试通过文件扩展名判断
  const mimeByExt = getMimeTypeByExtension(file.name);
  if (mimeByExt) {
    if (mimeByExt.startsWith("text/") || SUPPORTED_DOCUMENT_TYPES.includes(mimeByExt)) {
      return true;
    }
  }

  return false;
}

// 检查是否为图片文件
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

// 检查是否为文本文件
export function isTextFile(mimeType: string): boolean {
  return mimeType.startsWith("text/");
}

// 检查是否为需要转换的文档文件
export function isDocumentFile(mimeType: string): boolean {
  return SUPPORTED_DOCUMENT_TYPES.includes(mimeType);
}

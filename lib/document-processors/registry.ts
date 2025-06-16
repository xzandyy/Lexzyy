import { ProcessorRegistry } from "./types";
import { extractTextFromPDF } from "./pdf-processor";
import { extractTextFromWord } from "./word-processor";
import { extractTextFromExcel } from "./excel-processor";
import { extractTextFromPowerPoint } from "./powerpoint-processor";
import {
  extractTextFromXML,
  extractTextFromJSON,
  extractTextFromXHTML,
  extractTextFromTEX,
  extractTextFromYAML,
  extractTextFromRSS,
  extractTextFromAtom,
} from "./text-formats-processor";

// 文件类型到处理器的映射表
export const DOCUMENT_PROCESSORS: ProcessorRegistry = {
  // PDF文件
  "application/pdf": {
    processor: extractTextFromPDF,
    description: "PDF文档",
  },

  // Word文档
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    processor: extractTextFromWord,
    description: "Word文档 (.docx)",
  },
  "application/msword": {
    processor: extractTextFromWord,
    description: "Word文档 (.doc)",
  },

  // Excel文档
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    processor: extractTextFromExcel,
    description: "Excel工作簿 (.xlsx)",
  },
  "application/vnd.ms-excel": {
    processor: extractTextFromExcel,
    description: "Excel工作簿 (.xls)",
  },

  // PowerPoint文档
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    processor: extractTextFromPowerPoint,
    description: "PowerPoint演示文稿 (.pptx)",
  },
  "application/vnd.ms-powerpoint": {
    processor: extractTextFromPowerPoint,
    description: "PowerPoint演示文稿 (.ppt)",
  },

  // 结构化文档
  "application/xml": {
    processor: extractTextFromXML,
    description: "XML文档 (.xml)",
  },
  "text/xml": {
    processor: extractTextFromXML,
    description: "XML文档 (.xml)",
  },
  "application/json": {
    processor: extractTextFromJSON,
    description: "JSON数据文件 (.json)",
  },
  "application/xhtml+xml": {
    processor: extractTextFromXHTML,
    description: "XHTML文档 (.xhtml)",
  },

  // LaTeX文档
  "application/x-latex": {
    processor: extractTextFromTEX,
    description: "LaTeX文档 (.tex)",
  },
  "application/x-tex": {
    processor: extractTextFromTEX,
    description: "TeX文档 (.tex)",
  },

  // YAML配置文件
  "application/x-yaml": {
    processor: extractTextFromYAML,
    description: "YAML配置文件 (.yml)",
  },
  "text/yaml": {
    processor: extractTextFromYAML,
    description: "YAML配置文件 (.yaml)",
  },
  "text/x-yaml": {
    processor: extractTextFromYAML,
    description: "YAML配置文件 (.yml/.yaml)",
  },

  // RSS和Atom订阅
  "application/rss+xml": {
    processor: extractTextFromRSS,
    description: "RSS订阅文件 (.rss)",
  },
  "application/atom+xml": {
    processor: extractTextFromAtom,
    description: "Atom订阅文件 (.atom)",
  },
};

// 检查文件类型是否支持
export const isFileTypeSupported = (mimeType: string): boolean => {
  return mimeType in DOCUMENT_PROCESSORS;
};

// 获取处理器
export const getProcessor = (mimeType: string) => {
  return DOCUMENT_PROCESSORS[mimeType];
};

// 统一导出所有文档处理器相关功能
export * from "./types";
export * from "./registry";
export { extractTextFromPDF } from "./pdf-processor";
export { extractTextFromWord } from "./word-processor";
export { extractTextFromExcel } from "./excel-processor";
export { extractTextFromPowerPoint } from "./powerpoint-processor";

export {
  extractTextFromXML,
  extractTextFromJSON,
  extractTextFromXHTML,
  extractTextFromTEX,
  extractTextFromYAML,
  extractTextFromRSS,
  extractTextFromAtom,
} from "./text-formats-processor";

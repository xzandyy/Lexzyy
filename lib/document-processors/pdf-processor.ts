import pdfParse from "pdf-parse";

// PDF文本提取 - 使用pdf-parse
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // 验证PDF文件头
    const header = String.fromCharCode(...uint8Array.slice(0, 4));
    if (header !== "%PDF") {
      throw new Error("不是有效的PDF文件");
    }

    // 转换为Node.js Buffer
    const nodeBuffer = Buffer.from(buffer);

    // 使用pdf-parse解析
    const data = await pdfParse(nodeBuffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error("PDF文件中没有可提取的文本内容");
    }

    // 格式化输出，添加页面信息
    let formattedText = `PDF文档 "${file.name}" 内容:\n\n`;
    formattedText += `总页数: ${data.numpages}\n\n`;
    formattedText += data.text;

    return formattedText.trim();
  } catch (error) {
    console.error("PDF解析错误:", error);
    throw new Error(`PDF文件解析失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
}

import mammoth from "mammoth";

export async function extractTextFromWord(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });

    if (!result.value || result.value.trim().length === 0) {
      throw new Error("Word文档中没有可提取的文本内容");
    }

    // 输出警告信息（如果有）
    if (result.messages && result.messages.length > 0) {
      console.warn("Word文档解析警告:", result.messages);
    }

    return result.value;
  } catch (error) {
    console.error("Word文档解析错误:", error);
    throw new Error(`Word文档解析失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
}

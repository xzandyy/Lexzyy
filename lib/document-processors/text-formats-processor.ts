// 文本格式处理器 - 处理各种可直接读取的文本格式

// 通用文本提取函数
async function extractTextFromFile(file: File, formatName: string): Promise<string> {
  try {
    const text = await file.text();

    if (!text || text.trim().length === 0) {
      throw new Error(`${formatName}文件中没有内容`);
    }

    return `${formatName}文档 "${file.name}" 内容:\n\n${text}`;
  } catch (error) {
    console.error(`${formatName}解析错误:`, error);
    throw new Error(`${formatName}文件解析失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
}

// XML文档处理
export async function extractTextFromXML(file: File): Promise<string> {
  return extractTextFromFile(file, "XML");
}

// JSON文档处理
export async function extractTextFromJSON(file: File): Promise<string> {
  try {
    const text = await file.text();

    if (!text || text.trim().length === 0) {
      throw new Error("JSON文件中没有内容");
    }

    // 验证JSON格式并格式化
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      return `JSON文档 "${file.name}" 内容:\n\n${formatted}`;
    } catch (jsonError) {
      // 如果JSON解析失败，返回原始文本
      return `JSON文档 "${file.name}" 内容 (格式可能有误):\n\n${text} ${jsonError}`;
    }
  } catch (error) {
    console.error("JSON解析错误:", error);
    throw new Error(`JSON文件解析失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
}

// XHTML文档处理
export async function extractTextFromXHTML(file: File): Promise<string> {
  return extractTextFromFile(file, "XHTML");
}

// TEX文档处理
export async function extractTextFromTEX(file: File): Promise<string> {
  return extractTextFromFile(file, "LaTeX");
}

// YAML文档处理
export async function extractTextFromYAML(file: File): Promise<string> {
  return extractTextFromFile(file, "YAML");
}

// RSS订阅处理
export async function extractTextFromRSS(file: File): Promise<string> {
  return extractTextFromFile(file, "RSS");
}

// Atom订阅处理
export async function extractTextFromAtom(file: File): Promise<string> {
  return extractTextFromFile(file, "Atom");
}

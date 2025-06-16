// 文档转换API调用

// 文档转换API
export async function convertDocumentToText(file: File): Promise<string> {
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
export function createTextDataUrl(text: string): string {
  return `data:text/plain;base64,${btoa(unescape(encodeURIComponent(text)))}`;
}

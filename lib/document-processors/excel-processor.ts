import * as XLSX from "xlsx";

// Excel文档文本提取
export async function extractTextFromExcel(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("Excel文件中没有工作表");
    }

    let allText = "";

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) return;

      // 添加工作表标题
      if (workbook.SheetNames.length > 1) {
        allText += `\n=== 工作表: ${sheetName} ===\n`;
      }

      try {
        // 转换为CSV格式的文本
        const csvText = XLSX.utils.sheet_to_csv(sheet);
        if (csvText.trim()) {
          allText += csvText + "\n";
        }

        // 如果CSV为空，尝试获取单元格文本
        if (!csvText.trim()) {
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          if (jsonData.length > 0) {
            jsonData.forEach((row: unknown) => {
              if (Array.isArray(row) && row.length > 0) {
                allText += row.map((cell) => String(cell || "")).join("\t") + "\n";
              }
            });
          }
        }
      } catch (sheetError) {
        console.warn(`处理工作表 ${sheetName} 时出错:`, sheetError);
      }
    });

    if (!allText.trim()) {
      throw new Error("Excel文件中没有可提取的内容");
    }

    return allText.trim();
  } catch (error) {
    console.error("Excel文档解析错误:", error);
    throw new Error(`Excel文档解析失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
}

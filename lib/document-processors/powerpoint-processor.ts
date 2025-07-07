import PptxParser from "node-pptx-parser";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// PowerPoint文档文本提取
export async function extractTextFromPowerPoint(file: File): Promise<string> {
  let tempFilePath: string | null = null;

  try {
    // 获取文件buffer
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // 验证是否为PowerPoint文件
    const header = uint8Array.slice(0, 8);

    // 检查PPTX文件签名 (ZIP文件格式)
    const isZip = header[0] === 0x50 && header[1] === 0x4b;
    // 检查PPT文件签名
    const isPpt = header[0] === 0xd0 && header[1] === 0xcf;

    if (!isZip && !isPpt) {
      throw new Error("不是有效的PowerPoint文件");
    }

    // 对于PPTX文件，使用node-pptx-parser
    if (isZip && file.type.includes("presentation")) {
      // 创建临时文件
      tempFilePath = join(tmpdir(), `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pptx`);
      writeFileSync(tempFilePath, uint8Array);

      // 使用PptxParser解析
      const parser = new PptxParser(tempFilePath);
      const slides = await parser.extractText();

      if (!slides || slides.length === 0) {
        throw new Error("PowerPoint文档中没有幻灯片或可提取的内容");
      }

      let extractedText = `PowerPoint presentation "${file.name}" content:\n\n`;

      slides.forEach((slide, index) => {
        extractedText += `=== Slide ${index + 1} ===\n`;

        if (slide.text && slide.text.length > 0) {
          // 过滤空白文本并合并
          const slideText = slide.text
            .filter((text) => text && text.trim().length > 0)
            .join("\n")
            .trim();

          if (slideText) {
            extractedText += slideText + "\n\n";
          } else {
            extractedText += "[This slide has no text content]\n\n";
          }
        } else {
          extractedText += "[This slide has no text content]\n\n";
        }
      });

      // 检查是否有有效内容
      if (extractedText.replace(/PowerPoint presentation[\s\S]*?content:\s*/, "").trim().length === 0) {
        throw new Error("PowerPoint文档中没有可提取的文本内容");
      }

      return extractedText.trim();
    }

    // 对于PPT文件，目前只返回基本信息
    if (isPpt) {
      return `PowerPoint document "${file.name}" has been processed.
      
File information:
- File name: ${file.name}
- File size: ${(file.size / 1024 / 1024).toFixed(2)} MB
- File type: ${file.type}

Note: The text extraction for old PPT format is limited. It is recommended to convert the file to PPTX format for better text extraction.`;
    }

    throw new Error("不支持的PowerPoint文件格式");
  } catch (error) {
    console.error("PowerPoint文档处理错误:", error);
    throw new Error(`PowerPoint文档处理失败: ${error instanceof Error ? error.message : "未知错误"}`);
  } finally {
    // 清理临时文件
    if (tempFilePath) {
      try {
        unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.warn("清理临时文件失败:", cleanupError);
      }
    }
  }
}

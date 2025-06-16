import { NextRequest, NextResponse } from "next/server";
import { getProcessor, isFileTypeSupported } from "@/lib/document-processors";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "未找到文件" }, { status: 400 });
    }

    if (!isFileTypeSupported(file.type)) {
      return NextResponse.json(
        {
          error: `不支持的文件类型: ${file.type}`,
        },
        { status: 400 },
      );
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "文件过大，请选择小于100MB的文件" }, { status: 400 });
    }

    const processorInfo = getProcessor(file.type);

    try {
      // 使用对应的处理器处理文件
      const extractedText = await processorInfo.processor(file);

      if (!extractedText) {
        return NextResponse.json({ error: "无法从文件中提取文本内容" }, { status: 400 });
      }

      return NextResponse.json({
        text: extractedText,
        originalName: file.name,
        originalType: file.type,
        fileDescription: processorInfo.description,
        size: file.size,
      });
    } catch (error) {
      console.error("文档转换错误:", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "文档转换失败",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

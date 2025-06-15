import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToCoreMessages } from "ai";
import type { UIMessage, Attachment } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, data } = body;

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY 未配置");
      return new Response(JSON.stringify({ error: "OpenRouter API 密钥未配置" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("开始处理聊天请求，消息数量:", messages.length);

    // 处理附件数据
    if (data && Object.keys(data).length > 0) {
      console.log("检测到附件数据:", Object.keys(data));
    }

    // 创建OpenRouter客户端
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // 检查是否有不支持的文件类型
    const checkUnsupportedFiles = (attachments: Attachment[]) => {
      const unsupportedFiles = attachments.filter((attachment) => {
        const contentType = attachment.contentType;
        // 当前只支持图片和基本文本文件
        return (
          !contentType?.startsWith("image/") && !contentType?.startsWith("text/") && contentType !== "application/pdf"
        );
      });
      return unsupportedFiles;
    };

    // 确保消息格式正确
    const processedMessages = messages.map((message: UIMessage) => {
      if (message.experimental_attachments && message.experimental_attachments.length > 0) {
        console.log("处理消息附件:", message.experimental_attachments.length, "个文件");

        // 检查不支持的文件类型
        const unsupportedFiles = checkUnsupportedFiles(message.experimental_attachments);
        if (unsupportedFiles.length > 0) {
          console.log(
            "发现不支持的文件类型:",
            unsupportedFiles.map((f) => ({ name: f.name, type: f.contentType })),
          );

          // 为不支持的文件类型添加说明
          const unsupportedFileNames = unsupportedFiles.map((f) => f.name).join(", ");
          const warningText = `\n\n⚠️ 注意：以下文件类型暂不支持直接解析：${unsupportedFileNames}。\n当前支持的文件类型：图片（jpg, png, gif等）、文本文件（txt, md等）、PDF文档。\n\n如果您需要分析Word文档内容，建议：\n1. 将文档转换为PDF格式\n2. 复制文档中的关键文本到聊天框\n3. 截图文档的重要部分`;

          // 修改消息内容，添加警告
          const originalContent = message.content || "";
          message.content = originalContent + warningText;
        }

        // 转换附件为多模态内容
        const content = [];

        // 添加文本内容（如果有）
        if (message.content) {
          content.push({ type: "text", text: message.content });
        }

        // 添加支持的附件内容
        message.experimental_attachments.forEach((attachment, index: number) => {
          console.log(`处理附件 ${index + 1}:`, {
            name: attachment.name,
            contentType: attachment.contentType,
            hasUrl: !!attachment.url,
          });

          // 只处理图片类型的附件
          if (attachment.contentType?.startsWith("image/") && attachment.url) {
            content.push({
              type: "image",
              image: attachment.url,
            });
          }
          // 文本文件可以尝试处理
          else if (attachment.contentType?.startsWith("text/") && attachment.url) {
            // 对于文本文件，AI SDK 会自动处理
            console.log("检测到文本文件，将由AI SDK自动处理");
          }
        });

        return {
          ...message,
          content: content.length > 0 ? content : message.content,
        };
      }
      return message;
    });

    // 转换消息格式
    const coreMessages = convertToCoreMessages(processedMessages);

    console.log("转换后的消息格式:", JSON.stringify(coreMessages, null, 2));

    const result = streamText({
      model: openrouter.chat("openai/gpt-4o-mini"),
      messages: coreMessages,
      temperature: 0.7,
      maxTokens: 2048,
    });

    console.log("OpenRouter响应流已创建，准备返回");
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("详细OpenRouter API错误:", {
      message: error instanceof Error ? error.message : "未知错误",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "UnknownError",
    });

    return new Response(
      JSON.stringify({
        error: "与 AI 助手对话时发生错误",
        details: error instanceof Error ? error.message : "未知错误",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

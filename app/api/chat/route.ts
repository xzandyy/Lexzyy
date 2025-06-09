import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY 未配置");
      return new Response(JSON.stringify({ error: "OpenRouter API 密钥未配置" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("开始处理聊天请求，消息数量:", messages.length);

    // 创建OpenRouter客户端
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const result = streamText({
      model: openrouter.chat("openai/gpt-4o-mini"),
      // model: openrouter.chat("anthropic/claude-3.5-sonnet"),
      messages,
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

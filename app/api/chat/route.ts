import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { initializeServerPlugins } from "@/plugins";
import { pluginManager } from "@/lib/plugin-manager";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    await initializeServerPlugins();

    const body = await req.json();
    const { messages, pluginConfigs = {} } = body;

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY 未配置");
      return new Response(JSON.stringify({ error: "OpenRouter API 密钥未配置" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("开始处理聊天请求，消息数量:", messages.length);
    console.log("接收到的插件配置:", pluginConfigs);

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const chatOptions = {
      body: body,
      ...(body.experimental_attachments && { experimental_attachments: body.experimental_attachments }),
      ...(body.data && { data: body.data }),
      ...(body.headers && { headers: body.headers }),
    };

    console.log("构造的聊天上下文:", chatOptions);

    const tools = pluginManager.getFinalTools(pluginConfigs, chatOptions);

    console.log("启用的插件工具:", Object.keys(tools));

    const maxSteps = 5;
    const maxToolSteps = maxSteps - 1;

    const result = streamText({
      model: openrouter.chat("openai/gpt-4o-mini"),
      messages: messages,
      tools: tools,
      toolChoice: "auto",
      maxSteps: maxSteps,
      temperature: 0,
      system: `You are Lexzyy, an intelligent AI assistant with access to specialized tools.

**Tool Usage Guidelines:**
- Use tools only when they add genuine value to your response
- For simple questions, respond directly without tools
- For complex calculations or specialized tasks, leverage appropriate tools
- Maximum ${maxToolSteps} tool calls, then provide a comprehensive summary

**Response Style:**
- Be conversational yet professional
- Explain your reasoning for tool usage decisions
- Provide accurate, complete answers with helpful context
- If using tools, show progress transparently before your final summary

**Quality Standards:**
- Prioritize accuracy and thoroughness
- Anticipate follow-up questions
- Explain limitations clearly when encountered
- Focus on being genuinely helpful rather than just demonstrating capabilities

Your goal is to provide the most helpful response to serve the user's actual needs.`,
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

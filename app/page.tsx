"use client";

import { useChat } from "@ai-sdk/react";
import { Bot, AlertCircle, RotateCcw, Send, MessageCircle, Square } from "lucide-react";
import { MarkdownRenderer } from "@/components/renderers";
import { useEffect, useRef } from "react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, status, error, reload, stop } = useChat({
    onError: (error) => {
      console.error("详细聊天错误:", error);
      console.error("错误类型:", typeof error);
    },
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  // 当用户发送消息后，滚动到合适位置
  const scrollToUserMessage = () => {
    if (lastUserMessageRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const userMessage = lastUserMessageRef.current;

      // 计算滚动位置，让用户消息显示在容器上方1/3处
      const containerHeight = container.clientHeight;
      const messageTop = userMessage.offsetTop;
      const targetScrollTop = messageTop - containerHeight * 0.2;

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // 只在用户发送新消息时触发滚动定位
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        // 延迟执行，确保DOM已更新
        setTimeout(() => {
          scrollToUserMessage();
        }, 100);
      }
    }
  }, [messages.length]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* 头部  */}
      <div className="bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-gray-700" />
            <h1 className="text-lg font-semibold text-gray-900">Frychic</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {status === "streaming" && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>正在回复...</span>
              </>
            )}
            {status === "ready" && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>在线</span>
              </>
            )}
            {status === "error" && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>错误</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
        <div className="max-w-4xl mx-auto p-6">
          {/* 消息列表 */}
          <div className="space-y-8 pt-4 pb-32">
            {messages.map((message, index) => (
              <div key={message.id} className="group">
                {message.role === "user" ? (
                  /* 用户消息 - 右对齐 */
                  <div
                    className="flex items-start space-x-4 justify-end"
                    ref={index === messages.length - 1 && message.role === "user" ? lastUserMessageRef : null}
                  >
                    {/* 消息内容 */}
                    <div className="max-w-[80%]">
                      <div className="bg-gray-100 text-gray-800 rounded-3xl px-4 py-3">
                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* AI消息 - 左对齐 */
                  <div className="flex items-start space-x-4">
                    {/* 消息内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-sm max-w-none">
                        <MarkdownRenderer content={message.content} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 错误信息 */}
            {error && (
              <div className="group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-gray-800 font-medium mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>连接失败</span>
                      </div>
                      <div className="text-gray-700 text-sm mb-3">{error.message || "未知错误，请检查网络连接"}</div>
                      <button
                        onClick={() => reload()}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 text-sm transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>重试</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 留白区域，为AI回复预留空间 */}
            {messages.length === 0 && !error && (
              <div className="h-[50vh] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium mb-2 text-gray-700">开始新对话</h3>
                  <p className="text-gray-500">我是Frychic，可以帮你解答问题、协助工作或进行创意讨论</p>
                  <div className="text-xs text-gray-400 mt-3">支持 Markdown、代码高亮、数学公式、图表和 Emoji 😊</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部输入框 */}
      <div className="p-6 pt-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm border border-gray-300 overflow-hidden">
              {/* 输入框区域 */}
              <div className="px-4 py-1">
                <textarea
                  value={input}
                  onChange={(e) => {
                    handleInputChange(e);
                    // 如果输入框为空，重置高度
                    if (!e.target.value) {
                      e.target.style.height = "40px";
                    }
                  }}
                  placeholder="发送消息给 Frychic..."
                  className="w-full pt-3 pb-1 min-h-[40px] focus:outline-none resize-none text-gray-800"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 184) + "px";
                  }}
                />
              </div>

              {/* 底部操作栏 */}
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  {/* 左侧区域 - 预留给未来功能 */}
                  <div className="flex items-center space-x-2">{/* 这里可以添加附件、表情等功能按钮 */}</div>

                  {/* 右侧发送/暂停按钮 */}
                  <div className="flex items-center space-x-2">
                    {status === "streaming" ? (
                      <button
                        type="button"
                        onClick={stop}
                        className="flex items-center space-x-2 p-3 bg-black hover:bg-gray-800 text-white rounded-full transition-all duration-200"
                        title="停止生成"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!input.trim()}
                        className="flex items-center space-x-2 p-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200"
                        title="发送消息"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useChat } from "@ai-sdk/react";
import ChatList from "@/components/chat-list";
import ChatInput from "@/components/chat-input";
import LeftSidebar from "@/components/left-sidebar";
import useScrollToUserMessage from "@/hooks/use-scroll-to-user-message";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, status, error, reload, stop } = useChat();
  const { lastUserMessageRef } = useScrollToUserMessage(messages);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      {/* 左侧边栏 */}
      <LeftSidebar />

      {/* 主聊天区域 */}
      <div className="pl-14 flex-1 flex flex-col min-w-0">
        <ChatList messages={messages} error={error} onRetry={reload} lastUserMessageRef={lastUserMessageRef} />

        <ChatInput
          input={input}
          status={status}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onStop={stop}
          onReload={reload}
        />
      </div>
    </div>
  );
}

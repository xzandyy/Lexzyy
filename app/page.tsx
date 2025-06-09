"use client";

import { useChat } from "@ai-sdk/react";
import { ChatHeader, ChatList, ChatInput, useScrollToUserMessage } from "@/components/chat";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, status, error, reload, stop } = useChat();
  const { lastUserMessageRef } = useScrollToUserMessage(messages);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <ChatHeader status={status} error={error} />

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
  );
}

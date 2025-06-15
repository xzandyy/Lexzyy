"use client";

import { useChat } from "@ai-sdk/react";
import ChatList from "@/components/chat-list";
import ChatInput from "@/components/chat-input";
import LeftSidebar from "@/components/left-sidebar";
import DragDropOverlay from "@/components/drag-drop-overlay";
import useScrollToUserMessage from "@/hooks/use-scroll-to-user-message";
import useAttachments from "@/hooks/use-attachments";
import ChatHeader from "@/components/chat-header";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, status, error, reload, stop } = useChat();
  const { lastUserMessageRef } = useScrollToUserMessage(messages);
  const attachments = useAttachments();

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      <DragDropOverlay isVisible={attachments.isDragOver} />

      <LeftSidebar />

      <div className="pl-14 flex-1 flex flex-col min-w-0">
        <ChatHeader status={status} />

        <ChatList messages={messages} error={error} onRetry={reload} lastUserMessageRef={lastUserMessageRef} />

        <ChatInput
          input={input}
          status={status}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onStop={stop}
          onReload={reload}
          attachments={attachments}
        />
      </div>
    </div>
  );
}

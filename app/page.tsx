"use client";

import { useChat } from "@ai-sdk/react";
import { useMemo } from "react";
import ChatList from "@/components/chat-list";
import ChatInput from "@/components/chat-input";
import LeftSidebar from "@/components/left-sidebar";
import useScrollToUserMessage from "@/hooks/use-scroll-to-user-message";
import ChatHeader from "@/components/chat-header";
import { Network, History, Settings } from "lucide-react";
import ChatFlow from "@/components/chat-flow";
import useLockedValue from "@/hooks/use-locked-value";

export default function Home() {
  const { messages, setMessages, input, handleInputChange, handleSubmit, status, error, reload, stop } = useChat();
  const lockedMessages = useLockedValue(messages, status, "streaming");
  const { lastUserMessageRef } = useScrollToUserMessage(messages);

  const sidebarTabs = useMemo(
    () => [
      {
        id: "chat-flow",
        icon: Network,
        label: "对话流",
        component: <ChatFlow messages={lockedMessages} setMessages={setMessages} status={status} />,
      },
      {
        id: "history",
        icon: History,
        label: "历史记录",
        component: undefined,
      },
      {
        id: "settings",
        icon: Settings,
        label: "设置",
        component: undefined,
      },
    ],
    [lockedMessages, setMessages, status],
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      <LeftSidebar defaultActiveTabId="chat-flow" tabs={sidebarTabs} />

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
        />
      </div>
    </div>
  );
}

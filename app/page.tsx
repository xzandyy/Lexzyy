"use client";

import { useMemo } from "react";
import { Network } from "lucide-react";
import ChatHeader from "@/components/chat-header";
import ChatList from "@/components/chat-list";
import ChatInput from "@/components/chat-input";
import LeftSidebar from "@/components/left-sidebar";
import ChatFlow from "@/components/chat-flow";
import useChatFlow from "@/hooks/use-chat-flow";

export default function Home() {
  const {
    status,
    handleInputChange,
    handleSubmit,
    stop,
    reload,
    messagesToShow,
    error,
    addMessageRefs,
    handleScrollActiveChange,
    autoFitViewNode,
    flowElements,
    flowCSSVariables,
    handleStyleConfigChange,
  } = useChatFlow();

  const chatflow = useMemo(
    () => ({
      id: "chat-flow",
      icon: Network,
      label: "对话流",
      component: (
        <ChatFlow
          autoFitViewNode={autoFitViewNode}
          nodes={flowElements.nodes}
          edges={flowElements.edges}
          flowCSSVariables={flowCSSVariables}
          onStyleConfigChange={handleStyleConfigChange}
        />
      ),
    }),
    [autoFitViewNode, flowElements, flowCSSVariables, handleStyleConfigChange],
  );

  const leftSidebarTabs = useMemo(() => [chatflow], [chatflow]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      <LeftSidebar defaultActiveTabId="chat-flow" tabs={leftSidebarTabs} />

      <div className="pl-14 flex-1 flex flex-col min-w-0">
        <ChatHeader status={status} />

        <ChatList
          status={status}
          error={error}
          messages={messagesToShow}
          onAddMessageRef={addMessageRefs}
          onActiveMessageChange={handleScrollActiveChange}
        />

        <ChatInput
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

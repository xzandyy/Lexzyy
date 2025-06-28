"use client";

import { useMemo } from "react";
import { Network, History, Settings } from "lucide-react";
import ChatHeader from "@/components/chat-header";
import ChatList from "@/components/chat-list";
import ChatInput from "@/components/chat-input";
import LeftSidebar from "@/components/left-sidebar";
import ChatFlow from "@/components/chat-flow";
import DragDropOverlay from "@/components/chat-input/drag-drop-overlay";
import useTheChat from "@/hooks/use-the-chat";

export default function Home() {
  const {
    status,
    error,
    input,
    handleInputChange,
    messagesToShow,
    handleMessageInview,
    styleConfig,
    setStyleConfig,
    getLayoutedElements,
    getFlowCssVariables,
    handleNodeDelete,
    handleNodeClick,
    handleSubmit,
    handleNewBranchSubmit,
    stop,
    reload,
  } = useTheChat();

  // const sidebarTabs = useMemo(
  //   () => [
  //     {
  //       id: "chat-flow",
  //       icon: Network,
  //       label: "对话流",
  //       component: <ChatFlow getLayoutedElements={getLayoutedElements} onNodeClick={handleNodeClick} />,
  //     },
  //     {
  //       id: "history",
  //       icon: History,
  //       label: "历史记录",
  //       component: undefined,
  //     },
  //     {
  //       id: "settings",
  //       icon: Settings,
  //       label: "设置",
  //       component: undefined,
  //     },
  //   ],
  //   [getLayoutedElements, handleNodeClick],
  // );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      {/* <LeftSidebar defaultActiveTabId="chat-flow" tabs={sidebarTabs} /> */}

      <div className="pl-14 flex-1 flex flex-col min-w-0">
        <ChatHeader status={status} />

        <ChatList messages={messagesToShow} />

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

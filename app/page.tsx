"use client";

import { Network, Settings } from "lucide-react";
import ChatHeader from "@/components/chat-header";
import ChatList from "@/components/chat-list";
import ChatInput from "@/components/chat-input";
import LeftSidebar from "@/components/left-sidebar";
import ChatFlow from "@/components/chat-flow";
import SettingsComponent from "@/components/settings";
import useLocale from "@/hooks/use-locale";
import useChats from "@/hooks/use-chats";

export default function Home() {
  const { t } = useLocale();
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
  } = useChats();

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      <LeftSidebar
        defaultActiveTabId="chat-flow"
        tabs={[
          {
            id: "chat-flow",
            icon: Network,
            label: t.navigation.chatFlow,
            keepAlive: true,
            render: () => (
              <ChatFlow
                autoFitViewNode={autoFitViewNode}
                nodes={flowElements.nodes}
                edges={flowElements.edges}
                flowCSSVariables={flowCSSVariables}
                onStyleConfigChange={handleStyleConfigChange}
              />
            ),
          },
          {
            id: "settings",
            icon: Settings,
            label: t.navigation.settings,
            keepAlive: true,
            render: () => <SettingsComponent />,
          },
        ]}
      />

      <div className="flex-1 flex flex-col min-w-0">
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

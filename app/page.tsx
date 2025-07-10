"use client";

import { Network, Settings, Puzzle } from "lucide-react";
import ChatHeader from "@/components/chat-header";
import ChatList from "@/components/chat-list";
import ChatInput from "@/components/chat-input";
import LeftSidebar from "@/components/left-sidebar";
import RightSidebar from "@/components/right-sidebar";
import ChatFlow from "@/components/chat-flow";
import ChatPlugin from "@/components/chat-plugin";
import SettingsComponent from "@/components/settings";
import useLocale from "@/hooks/use-locale";
import useChats from "@/hooks/use-chats";

export default function Home() {
  const { t } = useLocale();

  const { status, error, actions, list, flow, plugin } = useChats();

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white relative">
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
                autoFitViewNode={flow.autoFitViewNode}
                nodes={flow.nodes}
                edges={flow.edges}
                flowCSSVariables={flow.flowCSSVariables}
                onStyleConfigChange={flow.handleStyleConfigChange}
              />
            ),
          },
          {
            id: "plugins",
            icon: Puzzle,
            label: t.navigation.plugins,
            keepAlive: true,
            render: () => (
              <ChatPlugin
                enabledPlugins={plugin.enabledPlugins}
                onEnabledPluginsChange={plugin.handleEnabledPluginsChange}
                onPluginClick={plugin.handlePluginClick}
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

      <div className="flex-1 flex flex-col min-w-0 pl-12 pr-10 ml:px-0">
        <ChatHeader status={status} />

        <ChatList
          status={status}
          error={error}
          messages={list.messagesToShow}
          onAddMessageRef={list.addMessageRefs}
          onActiveMessageChange={list.handleScrollActiveChange}
        />

        <ChatInput
          status={status}
          onInputChange={actions.handleInputChange}
          onSubmit={actions.handleSubmit}
          onStop={actions.stop}
          onReload={actions.reload}
        />
      </div>

      <RightSidebar openPluginConfig={plugin.openPluginConfig} onConfigChange={plugin.handleConfigChange} />
    </div>
  );
}

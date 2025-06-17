import React, { useCallback, useMemo, useRef, useState } from "react";
import { ReactFlow, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ChatTree, createChatTree } from "./chat-tree";
import { nodeTypes } from "./node-components";
import { StyleConfigPanel } from "./style-config-panel";
import { calculateTextLayoutMetrics, generateLayoutedElements } from "./flow-utils";
import { DEFAULT_STYLE_CONFIG } from "./config";
import type { UIMessage, StyleConfig } from "./types";
import { useChat } from "@ai-sdk/react";

interface ChatFlowProps {
  messages: UIMessage[];
  status: ReturnType<typeof useChat>["status"];
  setMessages: (messages: UIMessage[]) => void;
}

export default function ChatFlow({ messages, setMessages, status }: ChatFlowProps) {
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE_CONFIG);
  const chatTree = useRef<ChatTree | null>(null);

  if (!chatTree.current) {
    chatTree.current = createChatTree();
  }

  const { nodes, edges } = useMemo(() => {
    chatTree.current!.updateFromMessages(messages, status);
    const result = generateLayoutedElements(chatTree.current!.tree, styleConfig);

    const activeNodeId = messages.length > 0 ? messages[messages.length - 1].id : null;

    const nodesWithActiveState = result.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isActive: node.id === activeNodeId,
      },
    }));

    return { nodes: nodesWithActiveState, edges: result.edges };
  }, [messages, status, styleConfig]);

  const onNodesChange = useCallback(() => {}, []);

  const onEdgesChange = useCallback(() => {}, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: { id: string }) => {
      if (chatTree.current) {
        const messagePath = chatTree.current.getMessagePath(node.id);
        setMessages(messagePath);
      }
    },
    [setMessages],
  );

  const cssVariables = useMemo(() => {
    const textLayoutMetrics = calculateTextLayoutMetrics(styleConfig);
    return {
      "--node-width": `${styleConfig.nodeWidth}px`,
      "--node-height": `${styleConfig.nodeHeight}px`,
      "--node-font-size": `${styleConfig.fontSize}px`,
      "--node-line-height": styleConfig.lineHeight,
      "--node-max-width": `${textLayoutMetrics.maxWidth}px`,
      "--node-text-height": `${textLayoutMetrics.exactTextHeight}px`,
      "--node-line-clamp": textLayoutMetrics.maxCompleteLines,
    } as React.CSSProperties;
  }, [styleConfig]);

  return (
    <div className="w-full h-full relative" style={cssVariables}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
      >
        <Controls />
      </ReactFlow>

      <StyleConfigPanel styleConfig={styleConfig} onStyleConfigChange={setStyleConfig} />
    </div>
  );
}

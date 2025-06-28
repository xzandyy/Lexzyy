import React, { useMemo, useState } from "react";
import { ReactFlow, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./node-components";
import { StyleConfigPanel } from "./style-config-panel";
import { calculateTextLayoutMetrics } from "./flow-utils";
import { DEFAULT_STYLE_CONFIG } from "./config";
import type { StyleConfig } from "./types";
import useChats from "@/hooks/use-chats";

interface ChatFlowProps {
  getLayoutedElements: ReturnType<typeof useChats>["getLayoutedElements"];
  onNodeClick: ReturnType<typeof useChats>["handleNodeClick"];
}

export default function ChatFlow({ getLayoutedElements, onNodeClick }: ChatFlowProps) {
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE_CONFIG);
  const { nodes, edges } = getLayoutedElements();
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

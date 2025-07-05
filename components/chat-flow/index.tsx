import React from "react";
import { ReactFlow, Controls, Edge, Node } from "@xyflow/react";
import { nodeTypes } from "./chat-node";
import { StyleConfigPanel } from "./style-config-panel";
import type { StyleConfig } from "./types";
import "@xyflow/react/dist/style.css";

interface ChatFlowProps {
  nodes: Node[];
  edges: Edge[];
  flowCSSVariables: React.CSSProperties;
  onStyleConfigChange: (styleConfig: StyleConfig) => void;
}

export default function ChatFlow({ nodes, edges, flowCSSVariables, onStyleConfigChange }: ChatFlowProps) {
  return (
    <div className="w-full h-full relative" style={flowCSSVariables}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        minZoom={0.2}
        fitView
        fitViewOptions={{
          padding: { top: "2%", bottom: "88%" },
          maxZoom: 0.8,
        }}
      >
        <Controls />
      </ReactFlow>

      <StyleConfigPanel onStyleConfigChange={onStyleConfigChange} />
    </div>
  );
}

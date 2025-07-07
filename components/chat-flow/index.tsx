import React, { useEffect, useState, useRef } from "react";
import { ReactFlow, Controls, Edge, Node, useReactFlow, ReactFlowProvider } from "@xyflow/react";
import { nodeTypes } from "./chat-node";
import { StyleConfigPanel } from "./style-config-panel";
import type { StyleConfig } from "./types";
import { DEFAULT_STYLE_CONFIG } from "./types";
import "@xyflow/react/dist/style.css";
import { useDebounce } from "@/hooks/use-debounce";

interface ChatFlowProps {
  nodes: Node[];
  edges: Edge[];
  autoFitViewNode: Node;
  flowCSSVariables: React.CSSProperties;
  onStyleConfigChange: (styleConfig: StyleConfig) => void;
}

const shareConfigs = {
  zoom: 0.8,
};

function ChatFlowInner({ autoFitViewNode, nodes, edges, flowCSSVariables, onStyleConfigChange }: ChatFlowProps) {
  const reactFlowInstance = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE_CONFIG);
  const styleConfigRef = useRef<StyleConfig>(styleConfig);
  styleConfigRef.current = styleConfig;

  const debouncedOnChange = useDebounce(onStyleConfigChange, 100);

  const handleStyleConfigChange = (newStyleConfig: StyleConfig) => {
    setStyleConfig(newStyleConfig);
    debouncedOnChange(newStyleConfig);
  };

  useEffect(() => {
    if (autoFitViewNode && reactFlowInstance) {
      const viewHeight = containerRef.current?.getBoundingClientRect().height || 0;
      const paddingTop = 36;
      const targetX = autoFitViewNode.position.x + styleConfigRef.current.nodeWidth / 2;
      const targetY = autoFitViewNode.position.y + ((viewHeight - paddingTop) * 0.5) / shareConfigs.zoom;

      reactFlowInstance.setCenter(targetX, targetY, {
        zoom: shareConfigs.zoom,
        duration: 600,
        interpolate: "linear",
      });
    }
  }, [autoFitViewNode, reactFlowInstance]);

  return (
    <div className="w-full h-full relative" style={flowCSSVariables}>
      <div ref={containerRef} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          minZoom={0.2}
          fitView
          fitViewOptions={{
            padding: { bottom: "80%" },
            maxZoom: shareConfigs.zoom,
          }}
        >
          <Controls />
        </ReactFlow>
      </div>

      <StyleConfigPanel styleConfig={styleConfig} onStyleConfigChange={handleStyleConfigChange} />
    </div>
  );
}

export default function ChatFlow(props: ChatFlowProps) {
  return (
    <ReactFlowProvider>
      <ChatFlowInner {...props} />
    </ReactFlowProvider>
  );
}

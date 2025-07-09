import React, { useEffect, useState, useRef } from "react";
import { ReactFlow, Controls, Edge, Node, useReactFlow, ReactFlowProvider } from "@xyflow/react";
import { Palette, Crosshair } from "lucide-react";
import { nodeTypes } from "./chat-node";
import { StyleConfigPanel } from "./style-config-panel";
import { Button, PanelHeader } from "@/components/common";
import useLocale from "@/hooks/use-locale";
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
  const { t } = useLocale();
  const reactFlowInstance = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE_CONFIG);
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);
  const cachedTargetRef = useRef<{ x: number; y: number } | null>({ x: 0, y: 0 });
  const styleConfigRef = useRef<StyleConfig>(styleConfig);
  styleConfigRef.current = styleConfig;

  const debouncedOnChange = useDebounce(onStyleConfigChange, 100);

  const handleStyleConfigChange = (newStyleConfig: StyleConfig) => {
    setStyleConfig(newStyleConfig);
    debouncedOnChange(newStyleConfig);
  };

  const toggleStylePanel = () => {
    setIsStylePanelOpen(!isStylePanelOpen);
  };

  const handleStylePanelClose = () => {
    setIsStylePanelOpen(false);
  };

  const quickLocate = () => {
    if (cachedTargetRef.current && reactFlowInstance) {
      reactFlowInstance.setCenter(cachedTargetRef.current.x, cachedTargetRef.current.y, {
        zoom: shareConfigs.zoom,
        duration: 600,
        interpolate: "linear",
      });
    }
  };

  useEffect(() => {
    if (autoFitViewNode && reactFlowInstance) {
      const viewHeight = containerRef.current?.getBoundingClientRect().height || 0;
      const paddingTop = 36;
      const targetX = autoFitViewNode.position.x + styleConfigRef.current.nodeWidth / 2;
      const targetY = autoFitViewNode.position.y + ((viewHeight - paddingTop) * 0.5) / shareConfigs.zoom;

      cachedTargetRef.current = { x: targetX, y: targetY };

      reactFlowInstance.setCenter(targetX, targetY, {
        zoom: shareConfigs.zoom,
        duration: 600,
        interpolate: "linear",
      });
    }
  }, [autoFitViewNode, reactFlowInstance]);

  return (
    <div className="w-full h-full relative flex flex-col" style={flowCSSVariables}>
      <PanelHeader label={t.flow.title}>
        <Button icon={Crosshair} variant="outline" size="sm" title={t.flow.locate} onClick={quickLocate} />
        <Button icon={Palette} variant="outline" size="sm" title={t.flow.style} onClick={toggleStylePanel} />
      </PanelHeader>

      <div ref={containerRef} className="w-full flex-1">
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

      <StyleConfigPanel
        styleConfig={styleConfig}
        onStyleConfigChange={handleStyleConfigChange}
        isOpen={isStylePanelOpen}
        onClose={handleStylePanelClose}
      />
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

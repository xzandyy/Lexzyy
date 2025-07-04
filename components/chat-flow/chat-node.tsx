import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FlowNodeData } from "./types";

const nodeRoleConfig = {
  user: {
    containerClasses: "bg-blue-50 border-blue-500",
    textClasses: "text-blue-700",
    edgeColor: "#1976d2",
    activeContainerClasses: "bg-blue-100 border-blue-600 ring-2 ring-blue-300",
    activeTextClasses: "text-blue-800",
  },
  assistant: {
    containerClasses: "bg-purple-50 border-purple-600",
    textClasses: "text-purple-700",
    edgeColor: "#7b1fa2",
    activeContainerClasses: "bg-purple-100 border-purple-700 ring-2 ring-purple-300",
    activeTextClasses: "text-purple-800",
  },
  system: {
    containerClasses: "bg-amber-50 border-amber-600",
    textClasses: "text-amber-700",
    edgeColor: "#f59e0b",
    activeContainerClasses: "bg-amber-100 border-amber-700 ring-2 ring-amber-300",
    activeTextClasses: "text-amber-800",
  },
} as const;

const nodeBaseClasses = {
  container: "shadow-md rounded-md relative p-2 border-2 flex items-center justify-center",
  text: "text-center break-words w-full overflow-hidden",
};

function getNodeClasses(role: string, isActive: boolean) {
  const roleConfig = nodeRoleConfig[role as keyof typeof nodeRoleConfig];
  if (!roleConfig)
    return {
      containerClasses: nodeBaseClasses.container,
      textClasses: nodeBaseClasses.text,
    };

  return {
    containerClasses: `${nodeBaseClasses.container} ${isActive ? roleConfig.activeContainerClasses : roleConfig.containerClasses}`,
    textClasses: `${nodeBaseClasses.text} ${isActive ? roleConfig.activeTextClasses : roleConfig.textClasses}`,
  };
}

const ChatNode = memo(function ChatNode({ data }: { data: FlowNodeData }) {
  const { message, depth, isActive } = data;
  const { id, role } = message;
  const { containerClasses, textClasses } = getNodeClasses(role, isActive);

  return (
    <div
      onClick={() => data.handlers.onNodeClick(id, depth)}
      className={containerClasses}
      style={{
        width: "var(--node-width)",
        height: "var(--node-height)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <Handle type="target" position={Position.Top} className="invisible" />

      <div
        className={textClasses}
        style={{
          fontSize: "var(--node-font-size)",
          lineHeight: "var(--node-line-height)",
          maxWidth: "var(--node-max-width)",
          height: "var(--node-text-height)",
          maxHeight: "var(--node-text-height)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "var(--node-line-clamp)",
          WebkitBoxOrient: "vertical" as const,
          boxSizing: "border-box" as const,
          alignItems: "flex-start",
        }}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} className="invisible" />
    </div>
  );
});

export const nodeTypes = {
  userNode: ChatNode,
  assistantNode: ChatNode,
  systemNode: ChatNode,
};

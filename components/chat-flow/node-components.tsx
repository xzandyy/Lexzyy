import React from "react";
import { Handle, Position } from "@xyflow/react";
import { ChatNodeData } from "./types";
import { NODE_ROLE_CONFIG, NODE_BASE_CLASSES } from "./config";

export function ChatNodeComponent({ data }: { data: ChatNodeData }) {
  const { role } = data;

  const roleConfig = NODE_ROLE_CONFIG[role as keyof typeof NODE_ROLE_CONFIG];
  const containerClasses = `${NODE_BASE_CLASSES.container} ${roleConfig?.containerClasses || ""}`;
  const textClasses = `${NODE_BASE_CLASSES.text} ${roleConfig?.textClasses || ""}`;

  return (
    <div
      className={containerClasses}
      style={{
        width: "var(--node-width)",
        height: "var(--node-height)",
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
}

export function UserNodeComponent({ data }: { data: ChatNodeData }) {
  return <ChatNodeComponent data={data} />;
}

export function AssistantNodeComponent({ data }: { data: ChatNodeData }) {
  return <ChatNodeComponent data={data} />;
}

export const nodeTypes = {
  userNode: UserNodeComponent,
  assistantNode: AssistantNodeComponent,
};

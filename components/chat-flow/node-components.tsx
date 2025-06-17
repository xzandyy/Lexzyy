import React from "react";
import { Handle, Position } from "@xyflow/react";
import { ChatNodeData } from "./types";
import { NODE_ROLE_CONFIG, NODE_BASE_CLASSES } from "./config";

export function ChatNodeComponent({ data }: { data: ChatNodeData }) {
  const { role, isActive } = data;

  let containerClasses = NODE_BASE_CLASSES.container;
  let textClasses = NODE_BASE_CLASSES.text;

  if (role === "user") {
    containerClasses += ` ${isActive ? NODE_ROLE_CONFIG.user.activeContainerClasses : NODE_ROLE_CONFIG.user.containerClasses}`;
    textClasses += ` ${isActive ? NODE_ROLE_CONFIG.user.activeTextClasses : NODE_ROLE_CONFIG.user.textClasses}`;
  } else if (role === "assistant") {
    containerClasses += ` ${isActive ? NODE_ROLE_CONFIG.assistant.activeContainerClasses : NODE_ROLE_CONFIG.assistant.containerClasses}`;
    textClasses += ` ${isActive ? NODE_ROLE_CONFIG.assistant.activeTextClasses : NODE_ROLE_CONFIG.assistant.textClasses}`;
  }

  return (
    <div
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

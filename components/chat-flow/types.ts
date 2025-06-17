import type { UIMessage } from "ai";

export interface ChatNodeData extends Record<string, unknown> {
  message: UIMessage;
  label: string;
  role: UIMessage["role"];
  isRoot: boolean;
}

export interface StyleConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  fontSize: number;
  lineHeight: number;
  maxCharacters: number;
}

export type { UIMessage };

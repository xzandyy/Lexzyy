import { StyleConfig } from "./types";

export const STYLE_CONFIG_OPTIONS = {
  nodeWidth: {
    min: 1,
    max: 300,
    step: 1,
    default: 180,
    label: "宽度",
    unit: "px",
  },
  nodeHeight: {
    min: 1,
    max: 200,
    step: 1,
    default: 120,
    label: "高度",
    unit: "px",
  },
  horizontalSpacing: {
    min: 120,
    max: 400,
    step: 1,
    default: 200,
    label: "水平间距",
    unit: "px",
  },
  verticalSpacing: {
    min: 50,
    max: 300,
    step: 1,
    default: 150,
    label: "垂直间距",
    unit: "px",
  },
  fontSize: {
    min: 8,
    max: 24,
    step: 0.1,
    default: 16,
    label: "字体大小",
    unit: "px",
  },
  lineHeight: {
    min: 1,
    max: 2,
    step: 0.01,
    default: 1.5,
    label: "行高",
    unit: "",
  },
  maxCharacters: {
    min: 0,
    max: 200,
    step: 1,
    default: 50,
    label: "最大字符数",
    unit: "字符",
  },
} as const;

export const CONFIG_GROUPS = {
  nodeSize: {
    title: "节点尺寸",
    options: ["nodeWidth", "nodeHeight"] as const,
  },
  spacing: {
    title: "布局间距",
    options: ["horizontalSpacing", "verticalSpacing"] as const,
  },
  typography: {
    title: "文字样式",
    options: ["fontSize", "lineHeight", "maxCharacters"] as const,
  },
} as const;

export const DEFAULT_STYLE_CONFIG = {
  nodeWidth: STYLE_CONFIG_OPTIONS.nodeWidth.default,
  nodeHeight: STYLE_CONFIG_OPTIONS.nodeHeight.default,
  horizontalSpacing: STYLE_CONFIG_OPTIONS.horizontalSpacing.default,
  verticalSpacing: STYLE_CONFIG_OPTIONS.verticalSpacing.default,
  fontSize: STYLE_CONFIG_OPTIONS.fontSize.default,
  lineHeight: STYLE_CONFIG_OPTIONS.lineHeight.default,
  maxCharacters: STYLE_CONFIG_OPTIONS.maxCharacters.default,
} satisfies StyleConfig;

export const NODE_ROLE_CONFIG = {
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
} as const;

export const DEFAULT_EDGE_COLOR = "#757575";

export const NODE_BASE_CLASSES = {
  container: "shadow-md rounded-md relative p-2 border-2 flex items-center justify-center",
  text: "text-center break-words w-full overflow-hidden",
};

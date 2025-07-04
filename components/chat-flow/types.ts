import { UIMessage } from "ai";

export type FlowNodeHandlers = {
  onNodeClick: (id: string, index: number) => void;
};

export type FlowNodeData = {
  label: string;
  message: UIMessage;
  centerX: number;
  depth: number;
  isAwait: boolean;
  isActive: boolean;
  handlers: FlowNodeHandlers;
};

export type ActiveWay = "scroll" | "click";

export type ActiveNodeMethod = "activate" | "jump-fork" | "jump-node" | "init";

export type ActiveNodeData = {
  id: string;
  index: number;
  method: ActiveNodeMethod;
};

export const EMPTY_ACTIVE_NODE_DATA: ActiveNodeData = {
  id: "system",
  index: 0,
  method: "init",
};

export type StyleConfig = {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  fontSize: number;
  lineHeight: number;
  maxCharacters: number;
  edgeWidth: number;
  edgeType: "default" | "simplebezier" | "straight" | "step" | "smoothstep";
  edgeAnimated: boolean;
};

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
  edgeWidth: {
    min: 1,
    max: 10,
    step: 0.5,
    default: 2,
    label: "连线宽度",
    unit: "px",
  },
  edgeType: {
    options: [
      { value: "default", label: "默认" },
      { value: "simplebezier", label: "贝塞尔曲线" },
      { value: "straight", label: "直线" },
      { value: "step", label: "阶梯" },
      { value: "smoothstep", label: "平滑阶梯" },
    ],
    default: "default",
    label: "连线类型",
  },
  edgeAnimated: {
    default: false,
    label: "连线动画",
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
  edges: {
    title: "连线样式",
    options: ["edgeWidth", "edgeType", "edgeAnimated"] as const,
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
  edgeWidth: STYLE_CONFIG_OPTIONS.edgeWidth.default,
  edgeType: STYLE_CONFIG_OPTIONS.edgeType.default,
  edgeAnimated: STYLE_CONFIG_OPTIONS.edgeAnimated.default,
} satisfies StyleConfig;

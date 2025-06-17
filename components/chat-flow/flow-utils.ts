import { Edge, Node, Position } from "@xyflow/react";
import { ChatNodeData, StyleConfig } from "./types";
import Tree, { TreeNodeImpl } from "@/lib/tree";
import { UIMessage } from "./types";
import { NODE_ROLE_CONFIG, DEFAULT_EDGE_COLOR } from "./config";

export function generateLayoutedElements(tree: Tree<UIMessage>, styleConfig: StyleConfig) {
  const nodes: Node<ChatNodeData>[] = [];
  const edges: Edge[] = [];

  let currentDepth = -1;
  let indexInLevel = -1;

  tree.levelOrderTraversal((treeNode, depth) => {
    if (depth !== currentDepth) {
      currentDepth = depth;
      indexInLevel = 0;
    } else {
      indexInLevel++;
    }

    nodes.push(createNodeFromTreeNode(treeNode as TreeNodeImpl<UIMessage>, indexInLevel, depth, styleConfig));

    if (treeNode.parent) {
      edges.push(createEdgeFromTreeNode(treeNode as TreeNodeImpl<UIMessage>, styleConfig));
    }
  });

  return { nodes, edges };
}

export function calculateTextLayoutMetrics(styleConfig: StyleConfig) {
  const { nodeWidth, nodeHeight, fontSize, lineHeight } = styleConfig;

  const padding = 16;
  const availableHeight = Math.max(0, nodeHeight - padding);
  const lineHeightInPx = fontSize * lineHeight;
  const maxCompleteLines = Math.max(1, Math.floor(availableHeight / lineHeightInPx));
  const exactTextHeight = maxCompleteLines * lineHeightInPx;
  const maxWidth = Math.max(0, nodeWidth - padding);

  return {
    maxWidth,
    exactTextHeight,
    maxCompleteLines,
  };
}

export function createNodeFromTreeNode(
  treeNode: TreeNodeImpl<UIMessage>,
  indexInLevel: number,
  depth: number,
  styleConfig: StyleConfig,
): Node<ChatNodeData> {
  const message = treeNode.data;
  const isRoot = treeNode.isRoot();

  return {
    id: message.id,
    type: getNodeType(message.role),
    position: {
      x: indexInLevel * styleConfig.horizontalSpacing,
      y: depth * styleConfig.verticalSpacing,
    },
    data: {
      message,
      label: formatMessageLabel(message, styleConfig),
      role: message.role,
      isRoot,
      isActive: false,
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  };
}

export function createEdgeFromTreeNode(treeNode: TreeNodeImpl<UIMessage>, styleConfig: StyleConfig): Edge {
  const role = treeNode.data.role as keyof typeof NODE_ROLE_CONFIG;
  const color = NODE_ROLE_CONFIG[role]?.edgeColor || DEFAULT_EDGE_COLOR;

  return {
    id: `${treeNode.parent!.id}-${treeNode.id}`,
    source: treeNode.parent!.id,
    target: treeNode.id,
    type: styleConfig.edgeType,
    animated: styleConfig.edgeAnimated,
    style: {
      strokeWidth: styleConfig.edgeWidth,
      stroke: color,
    },
  };
}

export function getNodeType(role: string): string {
  return `${role}Node`;
}

export function formatMessageLabel(message: UIMessage, styleConfig: StyleConfig): string {
  const content = message.content;
  const { maxCharacters } = styleConfig;

  if (maxCharacters === 0) {
    return "";
  }

  if (content.length <= maxCharacters) {
    return content;
  }

  return content.substring(0, maxCharacters) + "...";
}

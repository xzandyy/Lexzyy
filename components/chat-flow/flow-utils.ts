import { Edge, Node, Position } from "@xyflow/react";
import { ChatNodeData, StyleConfig } from "./types";
import Tree, { TreeNodeImpl } from "@/lib/tree";
import { UIMessage } from "./types";
import { NODE_ROLE_CONFIG, DEFAULT_EDGE_COLOR } from "./config";

export function generateLayoutedElements(
  tree: Tree<UIMessage>,
  styleConfig: StyleConfig,
  activeNodeId?: string | null,
  status?: string,
) {
  if (tree.isEmpty()) {
    return { nodes: [], edges: [] };
  }

  const { horizontalSpacing, verticalSpacing } = styleConfig;
  const subtreeWidths = new Map<string, number>();
  const nodes: Node<ChatNodeData>[] = [];
  const edges: Edge[] = [];

  // 第一次遍历：后序计算子树宽度
  tree.postorderTraversal((treeNode) => {
    const nodeImpl = treeNode as TreeNodeImpl<UIMessage>;

    if (nodeImpl.children.length === 0) {
      subtreeWidths.set(nodeImpl.id, 1);
    } else {
      const totalWidth = nodeImpl.children.reduce((sum, child) => {
        return sum + (subtreeWidths.get(child.id) || 1);
      }, 0);
      subtreeWidths.set(nodeImpl.id, totalWidth);
    }
  });

  // 第二次遍历：前序计算位置并收集节点和边
  const root = tree.getRoot();
  if (root) {
    const rootImpl = root as TreeNodeImpl<UIMessage>;
    const totalWidth = subtreeWidths.get(rootImpl.id) || 1;

    const stack = [
      {
        node: rootImpl,
        left: 0,
        right: totalWidth,
        depth: 0,
      },
    ];

    while (stack.length > 0) {
      const { node: nodeImpl, left, right, depth } = stack.pop()!;
      const message = nodeImpl.data;

      // 计算位置并创建节点
      const centerX = (left + (right - left) / 2) * horizontalSpacing;
      nodes.push({
        id: message.id,
        type: `${message.role}Node`,
        position: { x: centerX, y: depth * verticalSpacing },
        data: {
          message,
          label: formatMessageLabel(message, styleConfig),
          role: message.role,
          isRoot: nodeImpl.isRoot(),
          isActive: message.id === activeNodeId,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      // 创建边（如果有父节点）
      if (nodeImpl.parent) {
        const role = message.role as keyof typeof NODE_ROLE_CONFIG;
        const color = NODE_ROLE_CONFIG[role]?.edgeColor || DEFAULT_EDGE_COLOR;

        // 只有在streaming状态下才为连接到active节点的边添加动画
        const isActiveEdge =
          status === "streaming" &&
          activeNodeId &&
          (nodeImpl.id === activeNodeId || nodeImpl.parent.id === activeNodeId);

        edges.push({
          id: `${nodeImpl.parent.id}-${nodeImpl.id}`,
          source: nodeImpl.parent.id,
          target: nodeImpl.id,
          type: styleConfig.edgeType,
          animated: isActiveEdge ? true : styleConfig.edgeAnimated,
          style: {
            strokeWidth: isActiveEdge ? styleConfig.edgeWidth + 1 : styleConfig.edgeWidth,
            stroke: isActiveEdge ? color : color,
            opacity: isActiveEdge ? 1 : 0.7,
          },
        });
      }

      // 为子节点添加到栈
      if (nodeImpl.children.length > 0) {
        const childStackItems = [];
        let currentLeft = left;

        // 正序计算子节点位置（从左到右）
        for (let i = 0; i < nodeImpl.children.length; i++) {
          const child = nodeImpl.children[i];
          const childWidth = subtreeWidths.get(child.id) || 1;
          const childRight = currentLeft + childWidth;

          childStackItems.push({
            node: child as TreeNodeImpl<UIMessage>,
            left: currentLeft,
            right: childRight,
            depth: depth + 1,
          });

          currentLeft = childRight;
        }

        // 逆序添加到栈中（这样栈顶是最左边的子节点，符合前序遍历）
        for (let i = childStackItems.length - 1; i >= 0; i--) {
          stack.push(childStackItems[i]);
        }
      }
    }
  }

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

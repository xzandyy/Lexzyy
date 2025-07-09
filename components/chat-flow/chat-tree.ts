import { Tree, TreeNode } from "@/lib/tree";
import { Edge, Node } from "@xyflow/react";
import { UIMessage } from "ai";
import { ActiveNodeData, FlowNodeData, FlowNodeHandlers, StyleConfig } from "./types";
import { ChatStatus } from "@/types";

type ChatTreeData = {
  message: UIMessage;
};

export const messageThrottle = 33.3;

const SUBMIT = 1 << 0;
const AWAIT = 1 << 1;
const STREAM = 1 << 2;
const SETTLE = 1 << 3;
const STAGE = 1 << 4;
const ACTIVATE = 1 << 5;
const JUMP_NODE = 1 << 6;
const JUMP_FORK = 1 << 7;
const RESTYLE = 1 << 8;
const CHANGE_ID = 1 << 9;
const SUBMIT_AWAIT = SUBMIT | AWAIT;
const SUBMIT_AWAIT_SETTLE_STREAM = SUBMIT | AWAIT | SETTLE | STREAM;
const SUBMIT_AWAIT_SETTLE_STREAM_ACTIVATE_RESTYLE_CHANGE_ID =
  SUBMIT | AWAIT | SETTLE | STREAM | ACTIVATE | RESTYLE | CHANGE_ID;
const AWAIT_SETTLE_STREAM = AWAIT | SETTLE | STREAM;

export default class ChatTree {
  // input
  newStatus: ChatStatus;
  oldStatus: ChatStatus;
  newSrcMessages: UIMessage[];
  oldSrcMessages: UIMessage[];
  newStyleConfig: StyleConfig;
  oldStyleConfig: StyleConfig;
  newActiveNodeData: ActiveNodeData;
  oldActiveNodeData: ActiveNodeData;
  handlers: FlowNodeHandlers;

  // internal
  tree: Tree<ChatTreeData> = new Tree<ChatTreeData>();
  subtreeWidths: Map<string, number> = new Map();
  flowNodes: Map<string, Node<FlowNodeData>> = new Map();
  flowEdges: Map<string, Edge> = new Map();
  updateFlags: number = 0;
  updateMessagesToShowAsSrc: boolean = true;
  lastSettleTime: number = 0;
  oldStreamMessageId: string | undefined = undefined;
  newStreamMessageId: string | undefined = undefined;

  // output
  messagesToShow: UIMessage[] = [];
  autoFitViewNode: Node<FlowNodeData>;
  flowElements: { nodes: Node<FlowNodeData>[]; edges: Edge[] } = { nodes: [], edges: [] };
  flowCSSVariables: React.CSSProperties = {};

  constructor(
    status: ChatStatus,
    messages: UIMessage[],
    styleConfig: StyleConfig,
    activeNodeData: ActiveNodeData,
    handlers: FlowNodeHandlers,
    systemMessage: UIMessage,
  ) {
    // input
    this.newStatus = this.oldStatus = status;
    this.newSrcMessages = this.oldSrcMessages = messages;
    this.newStyleConfig = this.oldStyleConfig = styleConfig;
    this.newActiveNodeData = this.oldActiveNodeData = activeNodeData;
    this.handlers = handlers;

    // internal
    this.setRoot(systemMessage);
    this.subtreeWidths.set(systemMessage.id, 1);
    this.flowNodes.set(systemMessage.id, {
      id: systemMessage.id,
      type: "systemNode",
      position: { x: 0, y: 0 },
      data: {
        label: this.formatMessageLabel(systemMessage),
        message: systemMessage,
        centerX: 0,
        depth: 0,
        isAwait: false,
        isActive: true,
        handlers: this.handlers,
      },
    });

    // output
    this.autoFitViewNode = this.flowNodes.get(systemMessage.id)!;
    this.messagesToShow = [systemMessage];
    this.renewFlowElements();
    this.updateFlowCSSVariables();
  }

  update(status: ChatStatus, messages: UIMessage[], styleConfig: StyleConfig, activeNodeData: ActiveNodeData) {
    // 0、update input //

    // update old values
    this.oldStatus = this.newStatus;
    this.oldSrcMessages = this.newSrcMessages;
    this.oldStyleConfig = this.newStyleConfig;
    this.oldActiveNodeData = this.newActiveNodeData;

    // update new values
    this.newStatus = status;
    this.newSrcMessages = messages;
    this.newStyleConfig = styleConfig;
    this.newActiveNodeData = activeNodeData;

    // 1、mark updates //

    this.updateFlags = 0;

    // a、srcMessages
    if (this.oldStatus !== this.newStatus) {
      if (this.newStatus === "submitted") {
        // submit: ready -> submitted
        this.updateFlags |= SUBMIT;
      } else if (this.newStatus === "streaming") {
        // await: submitted -> streaming
        this.updateFlags |= AWAIT;
      } else if (this.newStatus === "ready") {
        // settle: streaming -> ready
        this.updateFlags |= SETTLE;
        this.lastSettleTime = Date.now();
      }
    } else if (this.newStatus === "streaming") {
      // stream: streaming -> streaming
      this.updateFlags |= STREAM;
    } else if (this.oldSrcMessages !== this.newSrcMessages) {
      if (Date.now() - this.lastSettleTime < messageThrottle * 2) {
        // status ready but streaming
        this.updateFlags |= SETTLE;
      } else {
        // stage: setSrcMessages
        this.updateFlags |= STAGE;
      }
    }

    // b、activeNodeData
    if (this.oldActiveNodeData !== this.newActiveNodeData) {
      if (this.newActiveNodeData.method === "activate") {
        this.updateFlags |= ACTIVATE;
      } else if (this.newActiveNodeData.method === "jump-node") {
        this.updateFlags |= JUMP_NODE;
      } else if (this.newActiveNodeData.method === "jump-fork") {
        this.updateFlags |= ACTIVATE;
        this.updateFlags |= JUMP_FORK;
      }
    }

    // c、styleConfig
    if (this.oldStyleConfig !== this.newStyleConfig) {
      // restyle
      this.updateFlags |= RESTYLE;
    }

    // 2、updates to updates //

    // a、change_id
    if (this.updateFlags & SUBMIT) {
      this.oldStreamMessageId = undefined;
      this.newStreamMessageId = undefined;
    }

    if (this.updateFlags & AWAIT_SETTLE_STREAM) {
      const lastMessage = this.newSrcMessages.at(-1)!;
      if (this.newStreamMessageId && this.newStreamMessageId !== lastMessage.id) {
        this.updateFlags |= CHANGE_ID;
        this.oldStreamMessageId = this.newStreamMessageId;
        this.newStreamMessageId = lastMessage.id;
      }
      if (lastMessage.role === "assistant") {
        this.newStreamMessageId = lastMessage.id;
      }
    }

    // 3、apply updates //

    // a、update tree //

    // change_id
    if (this.updateFlags & CHANGE_ID) {
      this.replaceNode(this.oldStreamMessageId!, this.newSrcMessages.at(-1)!);
    }

    // submit/await
    if (this.updateFlags & SUBMIT_AWAIT) {
      const message = this.newSrcMessages.at(-1)!;
      const parentId = this.newSrcMessages.at(-2)!.id;
      this.setNode(message, parentId);
    }

    // settle
    if (this.updateFlags & SETTLE) {
      const message = this.newSrcMessages.at(-1)!;
      this.setNode(message);
    }

    // b、update element //

    // change_id
    if (this.updateFlags & CHANGE_ID) {
      const oldId = this.oldStreamMessageId!;
      const newId = this.newStreamMessageId!;
      // elements

      const oldFlowNode = this.flowNodes.get(oldId)!;
      const oldFlowEdge = this.flowEdges.get(oldId)!;

      this.flowNodes.set(newId, {
        ...oldFlowNode,
        id: newId,
        data: {
          ...oldFlowNode.data,
          label: "",
          message: this.newSrcMessages.at(-1)!,
        },
      });
      this.flowEdges.set(newId, {
        ...oldFlowEdge,
        id: `${oldFlowEdge.source}-${newId}`,
        target: newId,
      });
      this.flowNodes.delete(oldId);
      this.flowEdges.delete(oldId);

      // subtreeWidths
      const oldWidth = this.subtreeWidths.get(oldId)!;
      this.subtreeWidths.set(newId, oldWidth);
      this.subtreeWidths.delete(oldId);

      // activeNodeData
      if (this.oldActiveNodeData.id === oldId) {
        this.oldActiveNodeData.id = newId;
      }
      if (this.newActiveNodeData.id === oldId) {
        this.newActiveNodeData.id = newId;
      }
    }

    // submit/await
    if (this.updateFlags & SUBMIT_AWAIT) {
      const parentId = this.newSrcMessages.at(-2)!.id;
      const needFullUpdate = this.getNode(parentId)!.children.length !== 1;
      const isUpdateAwait = !!(this.updateFlags & AWAIT);

      if (needFullUpdate) {
        const { horizontalSpacing, verticalSpacing, edgeType, edgeAnimated, edgeWidth } = this.newStyleConfig;
        const message = this.newSrcMessages.at(-1)!;
        const root = this.getRoot()!;
        let pos: number = -this.subtreeWidths.get(root.id)! / 2;
        let prevParentId: string | undefined;
        const awaitMessageId = isUpdateAwait ? this.newSrcMessages.at(-1)!.id : undefined;

        this.tree.traverseToRoot(message.id, (treeNode) => {
          this.subtreeWidths.set(treeNode.id, (this.subtreeWidths.get(treeNode.id) || 0) + 1);
        });

        this.tree.levelOrderTraversal((treeNode, depth) => {
          const parentId = treeNode.parent?.id;
          const nodeId = treeNode.id;
          const message = treeNode.data.message;

          if (parentId && parentId !== prevParentId) {
            const parentWidth = this.subtreeWidths.get(parentId)!;
            const parentXPos = this.flowNodes.get(parentId)!.data.centerX;
            pos = parentXPos - parentWidth / 2;
          }

          const nodeWidth = this.subtreeWidths.get(nodeId)!;
          const centerX = Number((pos + nodeWidth / 2).toFixed(1));

          pos += nodeWidth;

          const isNodeAwait = isUpdateAwait && nodeId === awaitMessageId;

          this.flowNodes.set(nodeId, {
            id: nodeId,
            type: `${message.role}Node`,
            position: { x: centerX * horizontalSpacing, y: depth * verticalSpacing },
            data: {
              label: isNodeAwait ? "" : this.formatMessageLabel(message),
              message,
              centerX,
              depth,
              isAwait: isNodeAwait,
              isActive: false,
              handlers: this.handlers,
            },
          });

          if (parentId) {
            this.flowEdges.set(nodeId, {
              id: `${parentId}-${nodeId}`,
              source: parentId,
              target: nodeId,
              type: edgeType,
              animated: isUpdateAwait || edgeAnimated,
              style: {
                strokeWidth: edgeWidth,
              },
            });
          }

          prevParentId = parentId;
        });
      } else {
        const message = this.newSrcMessages.at(-1)!;
        const parentNode = this.flowNodes.get(this.newSrcMessages.at(-2)!.id)!;
        const { id, role } = message;
        const { centerX: parentCenterX, depth: parentDepth } = parentNode.data;
        const { horizontalSpacing, verticalSpacing, edgeType, edgeWidth } = this.newStyleConfig;
        const edgeId = `${parentNode.id}-${id}`;

        this.subtreeWidths.set(id, 1);

        this.flowNodes.set(id, {
          id,
          type: `${role}Node`,
          position: {
            x: parentCenterX * horizontalSpacing,
            y: (parentDepth + 1) * verticalSpacing,
          },
          data: {
            label: isUpdateAwait ? "" : this.formatMessageLabel(message),
            message,
            centerX: parentCenterX,
            depth: parentDepth + 1,
            isAwait: isUpdateAwait,
            isActive: false,
            handlers: this.handlers,
          },
        });

        this.flowEdges.set(id, {
          id: edgeId,
          source: parentNode.id,
          target: id,
          type: edgeType,
          animated: isUpdateAwait,
          style: { strokeWidth: edgeWidth },
        });
      }
    }
    // settle
    if (this.updateFlags & SETTLE) {
      const message = this.newSrcMessages.at(-1)!;
      const flowNode = this.flowNodes.get(message.id)!;
      const flowEdge = this.flowEdges.get(message.id)!;

      this.flowNodes.set(flowNode.id, {
        ...flowNode,
        data: {
          ...flowNode.data,
          label: this.formatMessageLabel(message),
          isAwait: false,
          message,
        },
      });

      this.flowEdges.set(flowNode.id, {
        ...flowEdge,
        animated: styleConfig.edgeAnimated,
      });
    }
    // activate
    if (this.updateFlags & ACTIVATE) {
      const oldActiveNode = this.flowNodes.get(this.oldActiveNodeData.id)!;
      const newActiveNode = this.flowNodes.get(this.newActiveNodeData.id)!;

      this.flowNodes.set(oldActiveNode.id, {
        ...oldActiveNode,
        data: {
          ...oldActiveNode.data,
          isActive: false,
        },
      });

      this.flowNodes.set(newActiveNode.id, {
        ...newActiveNode,
        data: {
          ...newActiveNode.data,
          isActive: true,
        },
      });
    }
    // restyle
    if (this.updateFlags & RESTYLE) {
      const { horizontalSpacing, verticalSpacing, edgeType, edgeAnimated, edgeWidth } = styleConfig;
      const {
        horizontalSpacing: oldHorizontalSpacing,
        verticalSpacing: oldVerticalSpacing,
        edgeType: oldEdgeType,
        edgeAnimated: oldEdgeAnimated,
        edgeWidth: oldEdgeWidth,
      } = this.oldStyleConfig;

      if (horizontalSpacing !== oldHorizontalSpacing || verticalSpacing !== oldVerticalSpacing) {
        this.flowNodes.forEach((node, id) => {
          this.flowNodes.set(id, {
            ...node,
            position: {
              x: node.data.centerX * horizontalSpacing,
              y: node.data.depth * verticalSpacing,
            },
          });
        });
      }

      if (edgeType !== oldEdgeType || edgeAnimated !== oldEdgeAnimated || edgeWidth !== oldEdgeWidth) {
        this.flowEdges.forEach((edge, id) => {
          this.flowEdges.set(id, {
            ...edge,
            type: edgeType,
            animated: edge.animated || edgeAnimated,
            style: { strokeWidth: edgeWidth },
          });
        });
      }
    }
    // renew when submit/await/settle/activate/restyle
    if (this.updateFlags & SUBMIT_AWAIT_SETTLE_STREAM_ACTIVATE_RESTYLE_CHANGE_ID) {
      this.renewFlowElements();
    }

    // c、update autoFitViewNode //

    // submit
    if (this.updateFlags & SUBMIT) {
      this.autoFitViewNode = this.flowNodes.get(this.newSrcMessages.at(-1)!.id)!;
    }

    // d、update toshow //

    // jump-node
    if (this.updateFlags & JUMP_NODE) {
      const { id } = this.newActiveNodeData;
      this.messagesToShow = this.getMessagesFromRoot(id);
      this.updateMessagesToShowAsSrc = this.messagesToShow.at(-1)?.id === this.newSrcMessages.at(-1)?.id;
    }
    // jump-fork
    if (this.updateFlags & JUMP_FORK) {
      const { id } = this.newActiveNodeData;
      this.messagesToShow = this.getMessagesFromRootToFirstFork(id);
      this.updateMessagesToShowAsSrc = this.messagesToShow.at(-1)?.id === this.newSrcMessages.at(-1)?.id;
    }
    // stage
    if (this.updateFlags & STAGE) {
      this.updateMessagesToShowAsSrc = true;
    }
    // submit/await/settle/stream
    if (this.updateFlags & SUBMIT_AWAIT_SETTLE_STREAM) {
      if (this.updateMessagesToShowAsSrc) {
        this.messagesToShow = this.newSrcMessages;
      }
    }

    // e、update css //

    // restyle
    if (this.updateFlags & RESTYLE) {
      this.updateFlowCSSVariables();
    }
  }

  private renewFlowElements() {
    this.flowElements = {
      nodes: [...this.flowNodes.values()],
      edges: [...this.flowEdges.values()],
    };
  }

  private updateFlowCSSVariables() {
    const { nodeWidth, nodeHeight, fontSize, lineHeight } = this.newStyleConfig;
    const { maxWidth, exactTextHeight, maxCompleteLines } = this.calculateTextLayoutMetrics();
    this.flowCSSVariables = {
      "--node-width": `${nodeWidth}px`,
      "--node-height": `${nodeHeight}px`,
      "--node-font-size": `${fontSize}px`,
      "--node-line-height": lineHeight,
      "--node-max-width": `${maxWidth}px`,
      "--node-text-height": `${exactTextHeight}px`,
      "--node-line-clamp": maxCompleteLines,
    } as React.CSSProperties;
  }

  private formatMessageLabel(message: UIMessage): string {
    const content = message.content;
    const { maxCharacters } = this.newStyleConfig;

    if (maxCharacters === 0) {
      return "";
    }

    if (content.length <= maxCharacters) {
      return content;
    }

    return content.substring(0, maxCharacters) + "...";
  }

  private calculateTextLayoutMetrics() {
    const { nodeWidth, nodeHeight, fontSize, lineHeight } = this.newStyleConfig;

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

  private getMessagesFromRoot(messageId: string): UIMessage[] {
    const path: UIMessage[] = [];
    this.tree.traverseToRoot(messageId, (node) => path.push(node.data.message));
    return path.reverse();
  }

  private getMessagesToFirstFork(messageId: string): UIMessage[] {
    const path: UIMessage[] = [];
    this.tree.traverseToFirstFork(messageId, (node) => path.push(node.data.message));
    return path;
  }

  private getMessagesFromRootToFirstFork(messageId: string): UIMessage[] {
    const toFirstFork = this.getMessagesToFirstFork(messageId);
    const fromRoot = this.getMessagesFromRoot(messageId);
    fromRoot.length = fromRoot.length - 1;
    return fromRoot.concat(toFirstFork);
  }

  private setRoot(message: UIMessage): void {
    this.tree.setRoot(message.id, { message });
  }

  private getRoot(): TreeNode<ChatTreeData> | undefined {
    return this.tree.getRoot();
  }

  private setNode(message: UIMessage, parentId?: string): void {
    this.tree.setNode(message.id, { message }, parentId);
  }

  private replaceNode(replaceId: string, message: UIMessage): void {
    this.tree.replaceNode(replaceId, message.id, { message });
  }

  private getNode(messageId: string): TreeNode<ChatTreeData> | undefined {
    return this.tree.getNode(messageId);
  }
}

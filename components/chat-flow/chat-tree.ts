import { Tree, createTree, TreeNodeImpl } from "@/lib/tree";
import type { UIMessage } from "./types";

export class ChatTree {
  tree: Tree<UIMessage>;

  constructor() {
    this.tree = createTree();
  }

  updateFromMessages(messages: UIMessage[], forceUpdate: boolean = false): void {
    if (messages.length === 0) return;

    if (this.tree.isEmpty()) {
      this.setRoot(messages[0]);
    }

    let lastExistingIndex = -1;

    if (!forceUpdate) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (this.hasMessage(messages[i].id)) {
          lastExistingIndex = i;
          break;
        }
      }
    }

    for (let i = lastExistingIndex + 1; i < messages.length; i++) {
      const message = messages[i];
      const parentMessage = messages[i - 1];

      try {
        this.setMessage(message, parentMessage?.id);
      } catch (error) {
        console.warn(`无法添加消息 ${message.id}:`, error);
      }
    }
  }

  getMessagePathFromRoot(messageId: string): UIMessage[] {
    const path: UIMessage[] = [];
    this.tree.traverseToRoot(messageId, (node) => path.push(node.data));
    return path.reverse();
  }

  getMessagePathToFirstLeaf(messageId: string): UIMessage[] {
    const path: UIMessage[] = [];
    this.tree.traverseToFirstLeaf(messageId, (node) => path.push(node.data));
    return path;
  }

  getMessagePathFromRootToFirstLeaf(messageId: string): UIMessage[] {
    const fromRoot = this.getMessagePathFromRoot(messageId);
    const toFirstLeaf = this.getMessagePathToFirstLeaf(messageId);
    return fromRoot.slice(0, -1).concat(toFirstLeaf);
  }

  private pruneToPath(nodeId: string): boolean {
    return this.tree.pruneToPath(nodeId);
  }

  private setRoot(message: UIMessage): void {
    this.tree.setRoot(message.id, message);
  }

  private setMessage(message: UIMessage, parentId?: string): void {
    this.tree.setNode(message.id, message, parentId);
  }

  removeMessage(messageId: string): boolean {
    return this.tree.removeNode(messageId);
  }

  private getMessage(messageId: string): TreeNodeImpl<UIMessage> | undefined {
    return this.tree.getNode(messageId) as TreeNodeImpl<UIMessage>;
  }

  private hasMessage(messageId: string): boolean {
    return this.tree.hasNode(messageId);
  }
}

export function createChatTree(): ChatTree {
  return new ChatTree();
}

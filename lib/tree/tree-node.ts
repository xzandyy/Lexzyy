import { TreeNode } from "./types";

/**
 * 树节点类实现
 */
export class TreeNodeImpl<T = unknown> implements TreeNode<T> {
  public id: string;
  public data: T;
  public children: TreeNode<T>[] = [];
  public parent?: TreeNode<T>;

  constructor(id: string, data: T, parent?: TreeNode<T>) {
    this.id = id;
    this.data = data;
    this.parent = parent;
  }

  /**
   * 添加子节点
   */
  addChild(child: TreeNode<T>): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * 移除子节点
   */
  removeChild(childId: string): boolean {
    const index = this.children.findIndex((child) => child.id === childId);
    if (index !== -1) {
      this.children[index].parent = undefined;
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 获取子节点
   */
  getChild(childId: string): TreeNode<T> | undefined {
    return this.children.find((child) => child.id === childId);
  }

  /**
   * 检查是否为叶子节点
   */
  isLeaf(): boolean {
    return this.children.length === 0;
  }

  /**
   * 检查是否为根节点
   */
  isRoot(): boolean {
    return this.parent === undefined;
  }

  /**
   * 获取节点深度
   */
  getDepth(): number {
    let depth = 0;
    let current: TreeNode<T> | undefined = this.parent;
    while (current) {
      depth++;
      current = current.parent;
    }
    return depth;
  }

  /**
   * 获取子树大小（包含自身）
   */
  getSubtreeSize(): number {
    let size = 1; // 包含自身
    for (const child of this.children) {
      size += (child as TreeNodeImpl<T>).getSubtreeSize();
    }
    return size;
  }
}

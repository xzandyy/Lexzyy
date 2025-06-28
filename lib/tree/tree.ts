import { TreeNode, TreeNodeJson, TraversalCallback } from "./types";
import { TreeNodeImpl } from "./tree-node";

/**
 * 多叉树类
 */
export class Tree<T = unknown> {
  private root?: TreeNode<T>;
  private nodeMap: Map<string, TreeNode<T>> = new Map();

  constructor(rootId?: string, rootData?: T) {
    if (rootId !== undefined && rootData !== undefined) {
      this.root = new TreeNodeImpl(rootId, rootData);
      this.nodeMap.set(this.root.id, this.root);
    }
  }

  /**
   * 设置根节点
   */
  setRoot(id: string, data: T): TreeNode<T> {
    this.root = new TreeNodeImpl(id, data);
    this.nodeMap.clear();
    this.nodeMap.set(this.root.id, this.root);
    return this.root;
  }

  /**
   * 获取根节点
   */
  getRoot(): TreeNode<T> | undefined {
    return this.root;
  }

  /**
   * 设置或添加节点
   */
  setNode(nodeId: string, data: T, parentId?: string): TreeNode<T> {
    // 如果节点已存在,更新数据
    const existingNode = this.nodeMap.get(nodeId);
    if (existingNode) {
      existingNode.data = data;
      return existingNode;
    }

    // 添加新节点
    if (!parentId) {
      throw new Error(`新节点 ${nodeId} 需要指定父节点`);
    }

    const parent = this.nodeMap.get(parentId);
    if (!parent) {
      throw new Error(`父节点 ${parentId} 不存在`);
    }

    const newNode = new TreeNodeImpl(nodeId, data, parent);
    parent.children.push(newNode);
    this.nodeMap.set(nodeId, newNode);

    return newNode;
  }

  /**
   * 获取节点
   */
  getNode(nodeId: string): TreeNode<T> | undefined {
    return this.nodeMap.get(nodeId);
  }

  /**
   * 判断节点是否存在
   */
  hasNode(nodeId: string): boolean {
    return this.nodeMap.has(nodeId);
  }

  /**
   * 删除节点及其子树
   */
  removeNode(nodeId: string): boolean {
    const node = this.nodeMap.get(nodeId);
    if (!node) {
      return false;
    }

    // 不能删除根节点
    if (node === this.root) {
      throw new Error("不能删除根节点");
    }

    // 从父节点中移除
    if (node.parent) {
      const parentNode = node.parent as TreeNodeImpl<T>;
      parentNode.removeChild(nodeId);
    }

    // 递归删除所有子节点
    this.removeNodeFromMap(node);
    return true;
  }

  /**
   * 移动节点到新的父节点下
   */
  moveNode(nodeId: string, newParentId: string): boolean {
    const node = this.nodeMap.get(nodeId);
    const newParent = this.nodeMap.get(newParentId);

    if (!node || !newParent) {
      return false;
    }

    // 不能移动根节点
    if (node === this.root) {
      throw new Error("不能移动根节点");
    }

    // 检查是否形成循环
    if (this.wouldCreateCycle(node, newParent)) {
      throw new Error("移动操作会形成循环");
    }

    // 从原父节点移除
    if (node.parent) {
      const oldParent = node.parent as TreeNodeImpl<T>;
      oldParent.removeChild(nodeId);
    }

    // 添加到新父节点
    node.parent = newParent;
    newParent.children.push(node);

    return true;
  }

  /**
   * 前序遍历
   */
  preorderTraversal(callback: TraversalCallback<T>, startNode?: TreeNode<T>): void {
    const node = startNode || this.root;
    if (!node) return;

    this.preorderTraversalRecursive(node, callback, 0);
  }

  /**
   * 后序遍历
   */
  postorderTraversal(callback: TraversalCallback<T>, startNode?: TreeNode<T>): void {
    const node = startNode || this.root;
    if (!node) return;

    this.postorderTraversalRecursive(node, callback, 0);
  }

  /**
   * 层序遍历
   */
  levelOrderTraversal(callback: TraversalCallback<T>): void {
    if (!this.root) return;

    const queue: Array<{ node: TreeNode<T>; depth: number }> = [{ node: this.root, depth: 0 }];

    while (queue.length > 0) {
      const { node, depth } = queue.shift()!;

      if (callback(node, depth) === false) {
        break;
      }

      for (const child of node.children) {
        queue.push({ node: child, depth: depth + 1 });
      }
    }
  }

  /**
   * 查找节点
   */
  findNode(predicate: (node: TreeNode<T>) => boolean): TreeNode<T> | undefined {
    if (!this.root) return undefined;

    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (predicate(node)) {
        return node;
      }
      stack.push(...node.children);
    }
    return undefined;
  }

  /**
   * 查找所有匹配的节点
   */
  findAllNodes(predicate: (node: TreeNode<T>) => boolean): TreeNode<T>[] {
    const result: TreeNode<T>[] = [];
    this.preorderTraversal((node) => {
      if (predicate(node)) {
        result.push(node);
      }
    });
    return result;
  }

  /**
   * 获取叶子节点
   */
  getLeafNodes(): TreeNode<T>[] {
    return this.findAllNodes((node) => node.children.length === 0);
  }

  /**
   * 获取树的高度
   */
  getHeight(): number {
    if (!this.root) return 0;
    return this.getNodeHeight(this.root);
  }

  /**
   * 获取树的节点总数
   */
  getSize(): number {
    return this.nodeMap.size;
  }

  /**
   * 清空树
   */
  clear(): void {
    this.root = undefined;
    this.nodeMap.clear();
  }

  /**
   * 检查树是否为空
   */
  isEmpty(): boolean {
    return this.root === undefined;
  }

  /**
   * 从指定节点向上遍历到根节点
   */
  traverseToRoot(nodeId: string, callback: (node: TreeNode<T>) => void): void {
    const node = this.nodeMap.get(nodeId);
    if (!node) return;

    let current: TreeNode<T> | undefined = node;
    while (current) {
      callback(current);
      current = current.parent;
    }
  }

  /**
   * 从指定节点向下遍历到第一个叶子节点
   */
  traverseToFirstLeaf(nodeId: string, callback: (node: TreeNode<T>) => void): void {
    const node = this.nodeMap.get(nodeId);
    if (!node) return;

    let current: TreeNode<T> = node;
    callback(current);

    while (current.children.length > 0) {
      current = current.children[0];
      callback(current);
    }
  }

  /**
   * 获取从根节点到指定节点的路径
   */
  getPathToNode(nodeId: string): TreeNode<T>[] {
    const path: TreeNode<T>[] = [];
    this.traverseToRoot(nodeId, (node) => path.push(node));
    return path.reverse();
  }

  /**
   * 获取两个节点的最近公共祖先
   */
  getLowestCommonAncestor(nodeId1: string, nodeId2: string): TreeNode<T> | undefined {
    const path1 = this.getPathToNode(nodeId1);
    const path2 = this.getPathToNode(nodeId2);

    if (path1.length === 0 || path2.length === 0) {
      return undefined;
    }

    let lca: TreeNode<T> | undefined;
    const minLength = Math.min(path1.length, path2.length);

    for (let i = 0; i < minLength; i++) {
      if (path1[i].id === path2[i].id) {
        lca = path1[i];
      } else {
        break;
      }
    }

    return lca;
  }

  /**
   * 转换为数组表示（层序遍历）
   */
  toArray(): T[] {
    const result: T[] = [];
    this.levelOrderTraversal((node) => {
      result.push(node.data);
    });
    return result;
  }

  /**
   * 修剪树结构，保留从指定节点到根的唯一路径
   * 向上只保留一条线路，向下保持原有的所有分支
   */
  pruneToPath(nodeId: string): boolean {
    const targetNode = this.nodeMap.get(nodeId);
    if (!targetNode) {
      return false; // 节点不存在
    }

    // 获取从目标节点到根的路径
    const pathToRoot = this.getPathToNode(nodeId);
    if (pathToRoot.length === 0) {
      return false;
    }

    // 从路径的第二个节点开始（跳过根节点），删除每个节点的兄弟节点
    for (let i = 1; i < pathToRoot.length; i++) {
      const currentNode = pathToRoot[i] as TreeNodeImpl<T>;
      const parentNode = currentNode.parent as TreeNodeImpl<T>;

      if (parentNode) {
        // 获取所有兄弟节点（除了当前路径节点）
        const siblings = parentNode.children.filter((child) => child.id !== currentNode.id);

        // 删除所有兄弟节点及其子树
        for (const sibling of siblings) {
          this.removeNodeFromMap(sibling);
          const parentImpl = parentNode as TreeNodeImpl<T>;
          parentImpl.removeChild(sibling.id);
        }
      }
    }

    return true;
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): TreeNodeJson | null {
    if (!this.root) return null;
    return this.nodeToJSON(this.root);
  }

  // 私有方法

  private generateId(): string {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private removeNodeFromMap(node: TreeNode<T>): void {
    this.nodeMap.delete(node.id);
    for (const child of node.children) {
      this.removeNodeFromMap(child);
    }
  }

  private wouldCreateCycle(node: TreeNode<T>, potentialParent: TreeNode<T>): boolean {
    let current: TreeNode<T> | undefined = potentialParent;
    while (current) {
      if (current.id === node.id) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  private preorderTraversalRecursive(node: TreeNode<T>, callback: TraversalCallback<T>, depth: number): boolean {
    if (callback(node, depth) === false) {
      return false;
    }

    for (const child of node.children) {
      if (!this.preorderTraversalRecursive(child, callback, depth + 1)) {
        return false;
      }
    }

    return true;
  }

  private postorderTraversalRecursive(node: TreeNode<T>, callback: TraversalCallback<T>, depth: number): boolean {
    for (const child of node.children) {
      if (!this.postorderTraversalRecursive(child, callback, depth + 1)) {
        return false;
      }
    }

    return callback(node, depth) !== false;
  }

  private getNodeHeight(node: TreeNode<T>): number {
    if (node.children.length === 0) {
      return 1;
    }

    let maxChildHeight = 0;
    for (const child of node.children) {
      const childHeight = this.getNodeHeight(child);
      maxChildHeight = Math.max(maxChildHeight, childHeight);
    }

    return maxChildHeight + 1;
  }

  private nodeToJSON(node: TreeNode<T>): TreeNodeJson {
    return {
      id: node.id,
      data: node.data,
      children: node.children.map((child) => this.nodeToJSON(child)),
    };
  }
}

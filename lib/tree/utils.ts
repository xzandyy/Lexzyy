import { Tree } from "./tree";
import { TreeArrayItem } from "./types";

/**
 * 工厂函数创建树
 */
export function createTree<T>(rootId?: string, rootData?: T): Tree<T> {
  return new Tree<T>(rootId, rootData);
}

/**
 * 从数组创建树（需要指定父子关系）
 */
export function createTreeFromArray<T extends TreeArrayItem>(items: T[]): Tree<T["data"]> {
  const tree = new Tree<T["data"]>();
  const nodeMap = new Map<string, T>();

  // 构建映射
  items.forEach((item) => nodeMap.set(item.id, item));

  // 找到根节点
  const rootItem = items.find((item) => !item.parentId);
  if (!rootItem) {
    throw new Error("未找到根节点");
  }

  tree.setRoot(rootItem.id, rootItem.data);

  // 递归构建树
  const buildSubtree = (parentId: string) => {
    const children = items.filter((item) => item.parentId === parentId);
    children.forEach((child) => {
      tree.addNode(parentId, child.id, child.data);
      buildSubtree(child.id);
    });
  };

  buildSubtree(rootItem.id);
  return tree;
}

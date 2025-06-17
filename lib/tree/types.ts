/**
 * 树节点接口
 */
export interface TreeNode<T = unknown> {
  id: string;
  data: T;
  children: TreeNode<T>[];
  parent?: TreeNode<T>;
}

/**
 * JSON序列化后的树节点接口
 */
export interface TreeNodeJson {
  id: string;
  data: unknown;
  children: TreeNodeJson[];
}

/**
 * 数组元素接口
 */
export interface TreeArrayItem {
  id: string;
  parentId?: string;
  data: unknown;
}

/**
 * 遍历回调函数类型
 */
export type TraversalCallback<T> = (node: TreeNode<T>, depth: number) => boolean | void;

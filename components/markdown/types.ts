import { Processor, PluggableList as UnifiedPluggableList } from "unified";
import type { ComponentType, JSX } from "react";
import type { Options as RemarkRehypeOptions } from "remark-rehype";
import type { Root as HastRoot } from "hast";
import type { Root as MdastRoot } from "mdast";

export type { UnifiedPluggableList, RemarkRehypeOptions, HastRoot, MdastRoot };

// 组件选项
export interface MarkdowndProps {
  uid: string;
  preset: string;
  children: string;
}

export interface MarkdownChunkProps {
  chunk: MarkdownChunk;
  preset: string;
}

// 分段
export type MarkdownChunk = {
  type: MarkdownLineType;
  content: string;
};

export type MarkdownLineType = "oneline" | "list" | "table" | "quote" | "code" | "unknown";

export type MarkdownCharMatcher = {
  matcher: string | RegExp;
  handler: MarkdownLineType | ((line: string, char: string, index: number) => MarkdownLineType);
};

// 预设
export type MarkdownPreset = {
  markdownToHastProcessorOptions?: MarkdownToHastProcessorOptions;
  markdownComponents?: MarkdownComponents;
};

export type MarkdownToHastProcessorOptions = {
  remarkPlugins?: UnifiedPluggableList;
  rehypePlugins?: UnifiedPluggableList;
  remarkRehypeOptions?: RemarkRehypeOptions;
};

export type MarkdownComponents = {
  [Key in keyof JSX.IntrinsicElements]?:
    | ComponentType<JSX.IntrinsicElements[Key] & MarkdownComponentExtraProps>
    | keyof JSX.IntrinsicElements;
};

export type MarkdownComponentExtraProps = {
  node?: Element;
};

// markdown -> hast
export type MarkdownToHastProcessor = Processor<MdastRoot, MdastExtendedRoot, HastRoot, undefined, undefined>;

export type MdastExtendedRoot = MdastRoot & {
  data: ChunkData;
};

export type ChunkData = {
  [key: string]: any;
};

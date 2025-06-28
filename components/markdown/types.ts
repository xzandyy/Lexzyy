import { Element, Root as HastRoot } from "hast";
import { ComponentType, JSX } from "react";
import { Root as MdastRoot } from "mdast";
import { Processor } from "unified";

export type LineType = "oneline" | "list" | "table" | "quote" | "code" | "unknown";

export type CharMatcher = {
  matcher: string | RegExp;
  handler: LineType | ((line: string, char: string, index: number) => LineType);
};

export type Chunk = {
  type: LineType;
  content: string;
};

export interface ExtraProps {
  node?: Element;
}

export type Components = {
  [Key in keyof JSX.IntrinsicElements]?:
    | ComponentType<JSX.IntrinsicElements[Key] & ExtraProps>
    | keyof JSX.IntrinsicElements;
};

export interface ProcessorOptions {
  preset?: string;
}

export interface Options extends ProcessorOptions {
  uid: string;
  children?: string;
}

export interface ChunkParseData {
  [key: string]: any;
}

export type MdastExtendedRoot = MdastRoot & {
  data?: (MdastRoot["data"] & ChunkParseData) | undefined;
};

export type MarkdownProcessorType = Processor<MdastRoot, MdastExtendedRoot, HastRoot, undefined, undefined>;

import { Root as HastRoot } from "hast";
import { Root as MdastRoot } from "mdast";
import { Options as RemarkRehypeOptions } from "remark-rehype";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { PluggableList, Processor, unified } from "unified";
import { VFile } from "vfile";
import { ChunkParseData, MdastExtendedRoot, ProcessorOptions } from "./types";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const emptyPlugins: PluggableList = [];
const emptyRemarkRehypeOptions: Readonly<RemarkRehypeOptions> = { allowDangerousHtml: true };
const markdownProcessorCache = new Map<string, MarkdownProcessorType>();
const processorOptionsPresets = {
  "chat-message": {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
};

export class MarkdownProcessor {
  private processor: MarkdownProcessorType;
  private parseTree: MdastExtendedRoot | null = null;
  private file: VFile;
  private data?: ChunkParseData | undefined;

  constructor(options: Readonly<ProcessorOptions>, content: string, data?: ChunkParseData) {
    this.processor = this.createProcessor(options);
    this.data = data;
    this.file = this.createFile(content);
  }

  parse() {
    const tree = this.processor.parse(this.file) as MdastExtendedRoot;
    if (this.data) {
      tree.data = {
        ...tree.data,
        ...this.data,
      };
    }
    this.parseTree = tree;
    return this;
  }

  runSync() {
    if (!this.parseTree) {
      throw new Error("Need to parse first");
    }
    return this.processor.runSync(this.parseTree, this.file);
  }

  run() {
    if (!this.parseTree) {
      throw new Error("Need to parse first");
    }
    return this.processor.run(this.parseTree, this.file);
  }

  private createProcessor(
    options: Readonly<ProcessorOptions>,
  ): Processor<MdastRoot, MdastExtendedRoot, HastRoot, undefined, undefined> {
    const processorCached = markdownProcessorCache.get(options.preset);
    if (processorCached) {
      return processorCached;
    }

    const remarkPlugins = options.remarkPlugins || emptyPlugins;
    const rehypePlugins = options.rehypePlugins || emptyPlugins;
    const remarkRehypeOptions = { ...emptyRemarkRehypeOptions, ...options.remarkRehypeOptions };

    const processor = unified()
      .use(remarkParse)
      .use(remarkPlugins)
      .use(remarkRehype, remarkRehypeOptions)
      .use(rehypePlugins);

    markdownProcessorCache.set(options.preset, processor);
    return processor;
  }

  private createFile(content: string): VFile {
    const file = new VFile();
    file.value = content;
    return file;
  }
}

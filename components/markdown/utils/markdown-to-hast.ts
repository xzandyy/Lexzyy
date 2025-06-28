import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { ChunkData, MarkdownToHastProcessor, MdastExtendedRoot } from "../types";
import { getPreset } from "./presets";
import { urlTransformPlugin } from "./url-transform-plugin";
import { VFile } from "vfile";

const markdownProcessorCache = new Map<string, MarkdownToHastProcessor>();

export function markdownToHast(preset: string, content: string, data?: ChunkData) {
  const processor = getMarkdownToHastProcessor(preset);
  const file = createFile(content);

  const mast = processor.parse(file) as MdastExtendedRoot;
  if (data) {
    mast.data = {
      ...mast.data,
      ...data,
    };
  }

  return processor.runSync(mast, file);
}

function getMarkdownToHastProcessor(preset: string): MarkdownToHastProcessor {
  const processorCached = markdownProcessorCache.get(preset);
  if (processorCached) {
    return processorCached;
  }

  const options = getPreset(preset).markdownToHastProcessorOptions || {};
  const remarkPlugins = options.remarkPlugins || [];
  const rehypePlugins = options.rehypePlugins || [];
  const remarkRehypeOptions = options.remarkRehypeOptions;

  const processor = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, remarkRehypeOptions)
    .use(rehypePlugins)
    .use(urlTransformPlugin);

  markdownProcessorCache.set(preset, processor);
  return processor;
}

function createFile(content: string): VFile {
  const file = new VFile();
  file.value = content;
  return file;
}

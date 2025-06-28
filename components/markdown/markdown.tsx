import { ReactNode, useRef, memo, useState, useEffect } from "react";
import { Options, Chunk } from "./types";
import { MarkdownProcessor } from "./markdown-processor";
import { hastToJSX } from "./hast-to-jsx";
import { ChunkProcessor } from "./chunk-processor";
import { Root as HastRoot } from "hast";

export default function Markdown({ uid, preset, children = "" }: Readonly<Options>): ReactNode {
  const processorOptions = processorOptionsPresets[preset];
  const chunkProcessor = useRef(new ChunkProcessor());
  const chunks = chunkProcessor.current.process(children);

  if (chunks.length === 0) return "";

  return (
    <>
      {chunks.map((chunk, index) => (
        <MarkdownChunk key={`${uid}-${index}`} chunk={chunk} preset={preset} />
      ))}
    </>
  );
}

type MarkdownChunkProps = Omit<Options, "uid"> & { chunk: Chunk };

const MarkdownChunk = memo(function MarkdownChunk({ chunk, preset }: MarkdownChunkProps): ReactNode {
  const processor = new MarkdownProcessor(
    {
      preset,
    },
    chunk.content,
  );
  const tree = processor.parse().runSync();

  if (tree) {
    return hastToJSX(tree, components || undefined);
  } else {
    return null;
  }
});

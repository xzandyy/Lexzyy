import { ReactNode, useRef, memo } from "react";
import { MarkdownChunkProps, MarkdowndProps } from "./types";
import { StreamingMarkdownProcessor } from "./utils/streaming-markdown-processor";
import { initPresets } from "./utils/presets";
import { markdownToHast } from "./utils/markdown-to-hast";
import { hastToJSX } from "./utils/hast-to-jsx";

initPresets();

export default function Markdown({ uid, preset, children }: MarkdowndProps): ReactNode {
  const chunkProcessor = useRef(new StreamingMarkdownProcessor());
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

const MarkdownChunk = memo(function MarkdownChunk({ chunk, preset }: MarkdownChunkProps): ReactNode {
  const hast = markdownToHast(preset, chunk.content);

  if (hast) {
    return hastToJSX(preset, hast);
  } else {
    return null;
  }
});

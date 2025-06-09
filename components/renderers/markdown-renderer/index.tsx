import { memo } from "react";
import MarkdownComponent from "./markdown-component";
import useChunks from "./use-chunks";

const MarkdownRenderer = memo(function MarkdownRenderer({ content }: { content: string }) {
  const chunks = useChunks(content);

  return (
    <div className="markdown-content">
      {chunks.map((chunk: string, index: number) => (
        <MarkdownComponent key={`chunk-${index}`} content={chunk} />
      ))}
    </div>
  );
});

export default MarkdownRenderer;

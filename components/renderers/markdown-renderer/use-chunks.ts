import { useMemo, useRef } from "react";

type MarkdownLineType = "heading" | "hr" | "paragraph" | "code" | "list" | "table" | "quote" | "empty";

function detectLineType(line: string): MarkdownLineType {
  const trimmedLine = line.trim();

  if (!trimmedLine) {
    return "empty";
  }
  if (trimmedLine.match(/^#{1,6}\s+/)) {
    return "heading";
  }
  if (trimmedLine.startsWith("---")) {
    return "hr";
  }
  if (trimmedLine.startsWith("```")) {
    return "code";
  }
  if (trimmedLine.match(/^[-*+]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
    return "list";
  }
  if (trimmedLine.startsWith(">")) {
    return "quote";
  }
  if (trimmedLine.includes("|") && (trimmedLine.match(/^\|.*\|$/) || trimmedLine.match(/^[|:\s-]+$/))) {
    return "table";
  }
  return "paragraph";
}

function processContent(content: string): [string[], string[]] {
  if (!content) {
    return [[], []];
  }

  const chunks: string[] = [];
  const lines = content.split("\n");

  let currentChunk = "";
  let currentType: MarkdownLineType = "empty";
  let isCodeBlock = false;
  let codeBlockDelimiter = "";

  const addChunk = () => {
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    currentChunk = "";
    currentType = "empty";
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineType = detectLineType(line);
    const addLine = () => {
      if (i === lines.length - 1) {
        currentChunk += line;
      } else {
        currentChunk += line + "\n";
      }
    };

    if (lineType === "code") {
      if (!isCodeBlock) {
        addChunk();
        currentChunk += line + "-loading\n";
        isCodeBlock = true;
        codeBlockDelimiter = line.match(/^(`{3,})(.*)/)?.[1] || "";
      } else if (line.startsWith(codeBlockDelimiter)) {
        addLine();
        currentChunk = currentChunk.replace(/^([^\n]*)-loading(.*)/, "$1$2");
        isCodeBlock = false;
        codeBlockDelimiter = "";
      } else {
        addLine();
      }
    } else if (isCodeBlock) {
      addLine();
    } else if (lineType === "empty") {
      addLine();
    } else if (["heading", "hr", "paragraph"].includes(lineType)) {
      addChunk();
      addLine();
    } else if (["list", "table", "quote"].includes(lineType)) {
      if (lineType === currentType) {
        addLine();
      } else {
        addChunk();
        addLine();
      }
    }

    currentType = lineType;
  }

  addChunk();

  if (chunks.length > 1) {
    const secondLastChunkType = detectLineType(chunks[chunks.length - 2].split("\n")[0]);
    const secondLastChunkCanBeMerged = ["list", "table", "quote"].includes(secondLastChunkType);
    const lastChunk = chunks[chunks.length - 1];

    if (
      !secondLastChunkCanBeMerged ||
      (secondLastChunkCanBeMerged &&
        lastChunk.includes("\n") &&
        detectLineType(lastChunk.split("\n")[0]) !== secondLastChunkType)
    ) {
      return [chunks.slice(0, -1), chunks.slice(-1)];
    } else {
      return [chunks.slice(0, -2), chunks.slice(-2)];
    }
  } else {
    return [[], chunks];
  }
}

function useChunks(content: string) {
  const stableChunksRef = useRef<string[]>([]);
  const stableChunksLengthRef = useRef(0);

  return useMemo(() => {
    const streamingContent = content.slice(stableChunksLengthRef.current);
    const [stableChunks, streamingChunks] = processContent(streamingContent);
    stableChunksRef.current.push(...stableChunks);
    stableChunksLengthRef.current += stableChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    return stableChunksRef.current.concat(streamingChunks);
  }, [content]);
}

export default useChunks;

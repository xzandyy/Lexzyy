import { MemoizedMarkdownComponent } from "./markdown-component";

interface MarkdownChunk {
  content: string;
  type: "heading" | "hr" | "paragraph" | "code" | "list" | "table" | "quote" | "empty";
}

function detectLineType(line: string): MarkdownChunk["type"] {
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

function processContent(content: string): MarkdownChunk[] {
  if (!content) {
    return [];
  }

  const chunks: MarkdownChunk[] = [];
  const lines = content.split("\n");
  let currentChunk = "";
  let currentType: MarkdownChunk["type"] = "empty";
  let isCodeBlock = false;
  let codeBlockDelimiter = "";

  const addChunk = () => {
    if (currentChunk) {
      chunks.push({
        content: currentChunk,
        type: currentType,
      });
    }
    currentChunk = "";
    currentType = "empty";
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineType = detectLineType(line);
    const addLine = () => {
      currentChunk += line + "\n";
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
  return chunks;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const chunks = processContent(content);

  return (
    <div className="markdown-content">
      {chunks.map((chunk: MarkdownChunk, index: number) => (
        <MemoizedMarkdownComponent key={`chunk-${index}`} content={chunk.content} />
      ))}
    </div>
  );
}

import { MarkdownChunk, MarkdownLineType, MarkdownCharMatcher } from "../types";

const matchers: MarkdownCharMatcher[] = [
  { matcher: "#", handler: "oneline" },
  { matcher: /\d/, handler: "list" },
  { matcher: "|", handler: "table" },
  { matcher: ">", handler: "quote" },
  {
    matcher: /[-+*]/,
    handler: (line) =>
      matchLineType(line, 1, [
        {
          matcher: " ",
          handler: "list",
        },
      ]),
  },
  {
    matcher: /[`~]/,
    handler: (line, char) =>
      matchLineType(line, 1, [
        {
          matcher: char,
          handler: (line, char) =>
            matchLineType(line, 2, [
              {
                matcher: char,
                handler: "code",
              },
            ]),
        },
      ]),
  },
];

function matchLineType(line: string, index: number, matchers: MarkdownCharMatcher[]) {
  if (line.length < index + 1) return "unknown";
  for (const { matcher, handler } of matchers) {
    const isMatch = typeof matcher === "string" ? line[index] === matcher : matcher.test(line[index]);
    if (isMatch) {
      return typeof handler === "string" ? handler : handler(line, line[index], index);
    }
  }
  return "oneline";
}

function getLineType(line: string): MarkdownLineType {
  return matchLineType(line.trimStart(), 0, matchers);
}

export class StreamingMarkdownProcessor {
  chunks: MarkdownChunk[] = [];
  cacheLine: MarkdownChunk = { content: "", type: "unknown" };
  endPos: number = 0;
  inCodeBlock: boolean = false;
  codeBlockDelimiter: string = "";
  updateCount: number = 0;

  process(content: string) {
    let line = this.cacheLine;
    this.updateCount = 0;

    for (let i = this.endPos; i < content.length; i++) {
      line.content += content[i];

      if (content[i] === "\n") {
        line = this.handleNewLine(line);
      } else if (line.type === "unknown") {
        line = this.handleUnknownLine(line);
      } else {
        line = this.handleKnownLine(line);
      }
    }

    this.cacheLine = line;
    this.endPos = content.length;
    this.updateChunks();

    return this.chunks;
  }

  private updateChunks() {
    for (let i = this.chunks.length - this.updateCount; i < this.chunks.length; i++) {
      const cloneChunk = { ...this.chunks[i] };
      if (this.cacheLine === this.chunks[i]) {
        this.cacheLine = cloneChunk;
      }
      this.chunks[i] = cloneChunk;
    }
  }

  private getLastChunk(): MarkdownChunk {
    return this.chunks[this.chunks.length - 1];
  }

  private mergeLineToLastChunk(line: MarkdownChunk, type?: MarkdownLineType): MarkdownChunk {
    const lastChunk = this.getLastChunk();
    lastChunk.content += line.content;
    if (type) {
      lastChunk.type = type;
    }
    this.updateCount ||= 1;
    return lastChunk;
  }

  private addLineAsNewChunk(line: MarkdownChunk, type?: MarkdownLineType): MarkdownChunk {
    if (type) {
      line.type = type;
    }
    this.chunks.push(line);
    this.updateCount++;
    return line;
  }

  private generateEmptyLine(): MarkdownChunk {
    return { content: "", type: "unknown" };
  }

  private handleNewLine(line: MarkdownChunk): MarkdownChunk {
    if (line.type === "unknown") {
      if (this.chunks.length > 0) {
        this.mergeLineToLastChunk(line);
      } else {
        this.addLineAsNewChunk(line, "oneline");
      }
    }
    return this.generateEmptyLine();
  }

  private handleUnknownLine(line: MarkdownChunk): MarkdownChunk {
    line.type = getLineType(line.content);

    if (line.type === "unknown") return line;

    if (this.inCodeBlock) {
      return this.handleCodeBlockContent(line);
    } else if (line.type === "code") {
      return this.handleCodeBlockStart(line);
    } else {
      return this.handleNormalContent(line);
    }
  }

  private handleKnownLine(line: MarkdownChunk): MarkdownChunk {
    this.updateCount ||= 1;
    return line;
  }

  private handleCodeBlockContent(line: MarkdownChunk): MarkdownChunk {
    if (this.isCodeBlockEnd(line)) {
      this.removeCodeLoadingMark(this.getLastChunk());
      this.resetCodeBlockState();
    }
    return this.mergeLineToLastChunk(line);
  }

  private handleCodeBlockStart(line: MarkdownChunk): MarkdownChunk {
    this.setCodeBlockState(line);
    this.addCodeLoadingMark(line);
    return this.addLineAsNewChunk(line);
  }

  private handleNormalContent(line: MarkdownChunk): MarkdownChunk {
    if (line.type === "oneline" || this.chunks.length === 0 || line.type !== this.getLastChunk().type) {
      return this.addLineAsNewChunk(line);
    }
    return this.mergeLineToLastChunk(line);
  }

  private isCodeBlockEnd(line: MarkdownChunk): boolean {
    return line.content.trimStart().startsWith(this.codeBlockDelimiter);
  }

  private addCodeLoadingMark(line: MarkdownChunk): void {
    line.content = line.content.replace(this.codeBlockDelimiter, this.codeBlockDelimiter + "loading-");
  }

  private removeCodeLoadingMark(chunk: MarkdownChunk): void {
    chunk.content = chunk.content.replace(this.codeBlockDelimiter + "loading-", this.codeBlockDelimiter);
  }

  private setCodeBlockState(line: MarkdownChunk): void {
    this.inCodeBlock = true;
    this.codeBlockDelimiter = line.content.match(/^\s*(`{3}|~{3})/)?.[1] || "";
  }

  private resetCodeBlockState(): void {
    this.inCodeBlock = false;
    this.codeBlockDelimiter = "";
  }
}

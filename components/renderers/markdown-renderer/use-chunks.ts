import { useRef } from "react";

function getLineType(line: string) {
  line = line.trimStart();
  if (!line) return "unknown";
  switch (line[0]) {
    case "#":
      return "oneline";
    case "-":
    case "+":
    case "*": {
      if (line.length < 2) return "unknown";
      if (line[1] === " ") return "list";
      return "oneline";
    }
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9": {
      if (line.length < 3) return "unknown";
      if (line[1] === "." && line[2] === " ") return "list";
      return "oneline";
    }
    case "|":
      return "table";
    case ">":
      return "quote";
    case "`":
    case "~": {
      if (line.length < 3) return "unknown";
      if (line.startsWith("```") || line.startsWith("~~~")) return "code";
      return "oneline";
    }
    default:
      return "oneline";
  }
}

type LineType = "oneline" | "list" | "table" | "quote" | "code" | "unknown";

type Chunk = {
  type: LineType;
  content: string;
};

function useChunks(content: string) {
  // 变量
  const chunks = useRef<Chunk[]>([]);
  const cacheUnknownLine = useRef<Chunk>({ content: "", type: "unknown" });
  const endPos = useRef(0);
  const inCodeBlock = useRef(false);
  const codeBlockDelimiter = useRef("");

  // 一个字符一个字符地读取，一行一行地处理
  let line = cacheUnknownLine.current;
  const pos = endPos.current;
  endPos.current = content.length;

  for (let i = pos; i < content.length; i++) {
    line.content += content[i];

    // 遇到换行符，开启新的一行
    if (content[i] === "\n") {
      // 如果当前行一直还是未知类型，看怎么合并
      if (line.type === "unknown") {
        if (chunks.current.length > 0) {
          // 1、有最后一块，合并进去
          chunks.current[chunks.current.length - 1].content += line.content;
        } else {
          // 2、没有最后一块，作为oneline合并
          line.type = "oneline";
          chunks.current.push(line);
        }
      }
      // 合并后，刷新当前行
      line = { content: "", type: "unknown" };
    } else {
      if (line.type === "unknown") {
        // 更新类型
        const type = (line.type = getLineType(line.content));

        // 如果还是未知类型，等待类型明确
        if (type === "unknown") continue;

        // 类型明确，看以什么方式合并

        // 0、在代码块中
        if (inCodeBlock.current) {
          const lastChunk = chunks.current[chunks.current.length - 1];

          // 注意此行是否是代码块结束
          if (line.content.trimStart().startsWith(codeBlockDelimiter.current)) {
            // 在代码块结束行删除-loading标记
            lastChunk.content = lastChunk.content.replace(
              codeBlockDelimiter.current + "loading-",
              codeBlockDelimiter.current,
            );
            // 代码块结束，重置状态
            inCodeBlock.current = false;
            codeBlockDelimiter.current = "";
          }
          // 合并
          lastChunk.content += line.content;
          line = lastChunk;
        } else if (type === "code") {
          // 注意此行是否是代码块开始
          inCodeBlock.current = true;
          codeBlockDelimiter.current = line.content.match(/^\s*(`{3,}|~{3,})/)?.[1] || "";
          // 在代码块开始行添加-loading标记
          line.content = line.content.replace(codeBlockDelimiter.current, codeBlockDelimiter.current + "loading-");
          // 合并
          chunks.current.push(line);
        } else if (chunks.current.length === 0) {
          // 1、没有最后一块，直接合并
          chunks.current.push(line);
        } else {
          // 2、有最后一块，看最后一块类型是否相同
          const lastChunk = chunks.current[chunks.current.length - 1];
          if (line.type !== lastChunk.type) {
            // 3、最后一块类型不同，直接合并
            chunks.current.push(line);
          } else {
            // 4、最后一块类型相同，合并
            lastChunk.content += line.content;
            line = lastChunk;
          }
        }
      }
    }
  }

  // 留下一点缓存，下次从这里开始
  cacheUnknownLine.current = line;

  return chunks.current;
}

export default useChunks;

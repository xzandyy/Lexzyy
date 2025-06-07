import React, { useMemo, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import MermaidRenderer from "./MermaidRenderer";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
  chunkSize?: number;
}

// 缓存的Markdown段落组件
const MemoizedMarkdownChunk = memo(({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        // 标题样式 - 增大标题大小
        h1: ({ children }) => <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-semibold text-gray-900 mb-3 mt-5 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4 first:mt-0">{children}</h3>,
        h4: ({ children }) => <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h4>,
        h5: ({ children }) => <h5 className="text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h5>,
        h6: ({ children }) => <h6 className="text-base font-medium text-gray-900 mb-2 mt-3 first:mt-0">{children}</h6>,

        // 段落样式
        p: ({ children }) => <p className="text-gray-800 mb-3 last:mb-0 leading-relaxed">{children}</p>,

        // 强调和加粗
        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-800">{children}</em>,

        // 删除线样式
        del: ({ children }) => <del className="line-through text-gray-800 px-1">{children}</del>,

        // 上标和下标
        sup: ({ children }) => <sup className="text-xs text-gray-700">{children}</sup>,
        sub: ({ children }) => <sub className="text-xs align-sub text-gray-700">{children}</sub>,

        // 代码样式 - 添加Mermaid图表支持
        code: ({ children, className, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");

          // 内联代码 - 改进样式
          if (!className || !match) {
            return (
              <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm" {...props}>
                {children}
              </code>
            );
          }

          const language = match[1];
          const codeString = String(children).replace(/\n$/, "");

          // Mermaid图表渲染
          if (language === "mermaid") {
            return <MermaidRenderer chart={codeString} />;
          }

          // 普通代码块 - 使用语法高亮
          return (
            <div className="my-4 rounded-lg overflow-hidden">
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  backgroundColor: "#2d3748", // 更浅的灰色
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          );
        },

        // 代码块容器
        pre: ({ children }) => <div>{children}</div>,

        // 链接样式 - 改进外观
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-blue-600 hover:bg-blue-50 px-1 py-0.5 rounded transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),

        //   无序列表样式 - 显示圆点
        ul: ({ children }) => <ul className="text-gray-800 list-disc ml-6">{children}</ul>,

        //   有序列表样式 - 显示数字，支持自定义起始数字
        ol: ({ children, start }) => (
          <ol className="text-gray-800 list-decimal ml-6" start={start}>
            {children}
          </ol>
        ),

        li: ({ children }) => {
          // 检查第一个子元素是否为checkbox
          const children_array = React.Children.toArray(children);
          const hasCheckbox =
            children_array.length > 0 &&
            React.isValidElement(children_array[0]) &&
            ((children_array[0] as React.ReactElement<{ type: { name: string } }>).type as { name: string }).name == "input";

          if (hasCheckbox) {
            return <li className="my-2 [&::marker]:font-bold list-none -ml-[1.3rem] [&>ul]:ml-12 [&>ol]:ml-12 relative">{children}</li>;
          }

          // 普通列表项
          return <li className="my-2 pl-[0.375rem] [&::marker]:font-bold">{children}</li>;
        },

        // 任务列表样式
        input: ({ checked, type, ...props }) => {
          if (type === "checkbox") {
            return (
              <input
                {...props}
                type="checkbox"
                disabled
                checked={checked}
                className={`w-4 h-4 appearance-none rounded relative border-1 mr-[0.375rem] top-[0.175rem]
                  ${
                    checked
                      ? "bg-blue-500 border-blue-500 after:content-['✓'] after:absolute after:text-white after:text-xs after:font-extrabold after:top-[-0.04rem] after:left-[0.2rem]"
                      : "bg-gray-100 border-gray-300"
                  }`}
              />
            );
          }
          return <input type={type} {...props} />;
        },

        // 引用样式 - 添加背景色
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-3 my-3 text-gray-700 italic rounded-r-lg">
            {children}
          </blockquote>
        ),

        // 表格样式 - 改善边框和分割线
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-100 border-b-2 border-gray-300">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y-2 divide-gray-200">{children}</tbody>,
        tr: ({ children }) => <tr className="hover:bg-gray-50 transition-colors">{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-r border-gray-300 last:border-r-0">{children}</th>
        ),
        td: ({ children }) => <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200 last:border-r-0">{children}</td>,

        // 分隔线样式
        hr: () => <hr className="my-6 border-t-2 border-gray-200" />,

        // ========== HTML 标签支持 ==========

        // 高亮标记
        mark: ({ children }) => <mark className="bg-yellow-200 text-gray-900 px-1 py-0.5 rounded">{children}</mark>,

        // 键盘按键
        kbd: ({ children }) => (
          <kbd className="bg-gray-200 border border-gray-400 rounded px-2 py-1 text-xs font-mono shadow-sm text-gray-700">{children}</kbd>
        ),

        // 折叠详情
        details: ({ children, open }) => (
          <details className="border border-gray-200 rounded-lg p-3 my-3 bg-gray-50 hover:bg-gray-100 transition-colors" open={open}>
            {children}
          </details>
        ),

        // 折叠标题
        summary: ({ children }) => (
          <summary className="font-semibold cursor-pointer hover:text-blue-600 transition-colors select-none outline-none focus:text-blue-600">
            ▶ {children}
          </summary>
        ),

        // 缩写提示
        abbr: ({ children, title }) => (
          <abbr title={title} className="border-b border-dotted border-gray-400 cursor-help hover:border-gray-600 transition-colors">
            {children}
          </abbr>
        ),

        // 小号文本
        small: ({ children }) => <small className="text-xs text-gray-600">{children}</small>,

        // 插入的文本
        ins: ({ children }) => <ins className="bg-green-100 text-green-800 px-1 rounded no-underline">{children}</ins>,

        // 变量
        var: ({ children }) => <var className="font-mono text-purple-600 italic bg-purple-50 px-1 rounded">{children}</var>,

        // 示例输出
        samp: ({ children }) => <samp className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded border">{children}</samp>,

        // 引用来源
        cite: ({ children }) => <cite className="italic text-gray-600">{children}</cite>,

        // 定义术语
        dfn: ({ children }) => <dfn className="font-semibold text-blue-700 border-b border-dotted border-blue-300">{children}</dfn>,

        // 时间
        time: ({ children, dateTime }) => (
          <time dateTime={dateTime} className="text-gray-700 border-b border-dotted border-gray-300">
            {children}
          </time>
        ),

        // 地址
        address: ({ children }) => (
          <address className="not-italic text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-gray-300 my-3">{children}</address>
        ),

        // 联系信息
        figure: ({ children }) => <figure className="my-4 text-center">{children}</figure>,

        figcaption: ({ children }) => <figcaption className="text-sm text-gray-600 italic mt-2">{children}</figcaption>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

MemoizedMarkdownChunk.displayName = "MemoizedMarkdownChunk";

// 经典文本分块算法
function splitContentIntoChunks(content: string, chunkSize: number): string[] {
  if (content.length <= chunkSize) {
    return [content];
  }

  // 按Markdown元素分块
  const elements = parseMarkdownElements(content);
  const chunks: string[] = [];
  let currentChunk = "";
  let currentElements: string[] = [];

  for (const element of elements) {
    const elementWithNewline = element + "\n\n";
    const isCodeBlock = element.trim().startsWith("```");

    // 代码块独立作为一个chunk
    if (isCodeBlock) {
      // 先保存当前积累的内容
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
        currentElements = [];
      }
      // 代码块单独作为一个chunk
      chunks.push(element);
    } else {
      // 检查添加当前元素是否会超出chunk大小
      if (currentChunk.length + elementWithNewline.length > chunkSize && currentElements.length > 0) {
        // 当前积累的元素作为一个chunk
        chunks.push(currentChunk.trim());
        currentChunk = elementWithNewline;
        currentElements = [element];
      } else {
        // 继续累加元素
        currentChunk += elementWithNewline;
        currentElements.push(element);
      }
    }
  }

  // 添加最后的chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [content];
}

// 解析Markdown元素的实现
function parseMarkdownElements(content: string): string[] {
  const lines = content.split("\n");
  const elements: string[] = [];
  let currentElement = "";
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 检测代码块
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // 代码块结束
        currentElement += line;
        elements.push(currentElement);
        currentElement = "";
        inCodeBlock = false;
      } else {
        // 保存之前的元素
        if (currentElement.trim()) {
          elements.push(currentElement.trim());
        }
        // 代码块开始
        currentElement = line + "\n";
        inCodeBlock = true;
      }
    } else if (inCodeBlock) {
      // 在代码块内
      currentElement += line + "\n";
    } else {
      // 检测元素边界
      const isNewElement =
        line.match(/^#{1,6}\s/) || // 标题
        line.match(/^\s*[-*+]\s/) || // 无序列表
        line.match(/^\s*\d+\.\s/) || // 有序列表
        line.match(/^\s*>\s/) || // 引用
        line.match(/^\s*\|.*\|/) || // 表格
        line.match(/^---+\s*$/) || // 分隔线
        (line.trim() === "" && currentElement.trim() !== ""); // 空行分割

      if (isNewElement && currentElement.trim()) {
        // 保存当前元素，开始新元素
        elements.push(currentElement.trim());
        currentElement = line + "\n";
      } else if (line.trim() !== "" || currentElement.trim() !== "") {
        // 继续当前元素（跳过连续空行）
        currentElement += line + "\n";
      }
    }
  }

  // 添加最后的元素
  if (currentElement.trim()) {
    elements.push(currentElement.trim());
  }

  return elements.filter((element) => element.trim());
}

export default function MarkdownRenderer({ content, className = "", isStreaming = true, chunkSize = 100 }: MarkdownRendererProps) {
  // 性能优化：分段渲染策略
  const renderedContent = useMemo(() => {
    // 如果内容较短或不是流式模式，直接渲染
    if (!isStreaming || content.length < chunkSize) {
      return <MemoizedMarkdownChunk content={content} />;
    }

    // 分段渲染 - 已完成的段落被缓存，只重新渲染最后变化的部分
    const chunks = splitContentIntoChunks(content, chunkSize);

    return (
      <>
        {/* 已完成的段落 - 这些会被React.memo缓存，不会重复渲染 */}
        {chunks.slice(0, -1).map((chunk, index) => (
          <MemoizedMarkdownChunk key={`stable-chunk-${index}-${chunk.slice(0, 50).replace(/\s/g, "")}`} content={chunk} />
        ))}

        {/* 正在变化的最后一个段落 - 只有这部分会重新渲染 */}
        {chunks.length > 0 && <MemoizedMarkdownChunk key={`current-chunk-${chunks.length - 1}`} content={chunks[chunks.length - 1]} />}
      </>
    );
  }, [content, isStreaming, chunkSize]);

  return <div className={`markdown-content ${className}`}>{renderedContent}</div>;
}

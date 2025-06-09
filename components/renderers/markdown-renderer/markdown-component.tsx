import React, { memo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import MermaidRenderer from "./mermaid-renderer";
import "katex/dist/katex.min.css";

const MarkdownComponent = memo(function MarkdownComponent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
      {content}
    </ReactMarkdown>
  );
});

export default MarkdownComponent;

const components: Components = {
  // heading
  h1: ({ children }) => <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-semibold text-gray-900 mb-3 mt-5 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h4>,
  h5: ({ children }) => <h5 className="text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h5>,
  h6: ({ children }) => <h6 className="text-base font-medium text-gray-900 mb-2 mt-3 first:mt-0">{children}</h6>,
  // hr
  hr: () => <hr className="my-6 border-t-2 border-gray-200" />,
  // paragraph
  p: ({ children }) => <p className="text-gray-800 mb-3 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
  del: ({ children }) => <del className="line-through text-gray-800 px-1">{children}</del>,
  sup: ({ children }) => <sup className="text-xs text-gray-700">{children}</sup>,
  sub: ({ children }) => <sub className="text-xs align-sub text-gray-700">{children}</sub>,
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
  // code
  pre: ({ children }) => {
    const codeElement = React.Children.toArray(children)[0] as React.ReactElement;
    const codeProps = codeElement.props as { className: string; children: string };
    const match = /language-(\w+)(-loading)?/.exec(codeProps.className || "");
    const language = match?.[1] ?? "";
    const isLoading = match?.[2] === "-loading";
    const codeString = String(codeProps.children).replace(/\n$/, "");

    // Mermaid图表渲染
    if (language === "mermaid") {
      return <MermaidRenderer chart={isLoading ? "" : codeString} loading={isLoading} />;
    }

    return (
      <pre className="my-4 rounded-lg overflow-x-auto">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          customStyle={{
            margin: 0,
            padding: "16px",
            fontSize: "14px",
            lineHeight: "1.5",
            backgroundColor: "#2d3748",
            whiteSpace: "pre",
            wordWrap: "normal",
            overflowWrap: "normal",
          }}
          wrapLongLines={false}
        >
          {codeString}
        </SyntaxHighlighter>
      </pre>
    );
  },
  code: ({ children }) => {
    return <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm break-all">{children}</code>;
  },
  // quote
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-400 bg-blue-50 px-4 py-3 my-3 text-gray-700 italic rounded-r-lg">
      {children}
    </blockquote>
  ),
  // list
  ul: ({ children }) => <ul className="text-gray-800 list-disc ml-6">{children}</ul>,
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
      return (
        <li className="my-2 [&::marker]:font-bold list-none -ml-[1.3rem] [&>ul]:ml-12 [&>ol]:ml-12 relative">
          {children}
        </li>
      );
    }

    // 普通列表项
    return <li className="my-2 pl-[0.375rem] [&::marker]:font-bold">{children}</li>;
  },
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
  // table
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 max-w-full">
      <table className="min-w-full border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-100 border-b-2 border-gray-300">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y-2 divide-gray-200">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-gray-50 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-r border-gray-300 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200 last:border-r-0">{children}</td>
  ),
};

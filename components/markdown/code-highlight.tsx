/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Highlight, themes } from "prism-react-renderer";

// 外部常量样式配置
const customStyle = {
  margin: 0,
  padding: "16px",
  fontSize: "14px",
  lineHeight: "1.5",
  backgroundColor: "#2d3748",
  whiteSpace: "pre" as const,
  wordWrap: "normal" as const,
  overflowWrap: "normal" as const,
  borderRadius: "0.5rem",
};

// 简化的代码高亮组件
function CodeHighlight({ codeString, language }: { codeString: string; language: string }) {
  return (
    <div className="my-4 rounded-lg overflow-x-auto">
      <Highlight theme={themes.vsDark} code={codeString} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }: any) => (
          <pre style={{ ...style, ...customStyle }}>
            {tokens.map((line: any, i: number) => (
              <div key={i} {...getLineProps({ line })}>
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {line.map((token: any, tokenIndex: number) => {
                  // 调用函数但不实际渲染span，用于性能测试
                  const a = getTokenProps({ token }); // 执行解析逻辑但不使用结果
                  return <span key={tokenIndex} {...a} />;
                })}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default CodeHighlight;
